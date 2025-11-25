-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS suporte_ti_escola
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE suporte_ti_escola;

-- =========================
-- TABELAS
-- =========================

-- Usuários (tanto solicitantes quanto técnicos)
CREATE TABLE usuarios (
    id_usuario       INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(100) NOT NULL,
    email            VARCHAR(100) NOT NULL UNIQUE,
    senha_hash       VARCHAR(255) NOT NULL,
    tipo_usuario     ENUM('SOLICITANTE','SUPORTE') NOT NULL,
    ativo            TINYINT(1) NOT NULL DEFAULT 1,
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Equipamentos
CREATE TABLE equipamentos (
    id_equipamento   INT AUTO_INCREMENT PRIMARY KEY,
    descricao        VARCHAR(150) NOT NULL,
    numero_serie     VARCHAR(100),
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Locais (salas, laboratórios etc.)
CREATE TABLE locais (
    id_local         INT AUTO_INCREMENT PRIMARY KEY,
    nome_local       VARCHAR(100) NOT NULL,
    descricao        VARCHAR(150),
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Chamados
CREATE TABLE chamados (
    id_chamado            INT AUTO_INCREMENT PRIMARY KEY,
    id_equipamento        INT NOT NULL,
    id_local              INT NOT NULL,
    id_solicitante        INT NOT NULL,
    id_responsavel_suporte INT NULL,
    data_abertura         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fechamento       DATETIME NULL,
    status                ENUM('ABERTO','EM_ANALISE','CONCLUIDO') NOT NULL DEFAULT 'ABERTO',
    descricao_problema    TEXT NOT NULL,
    descricao_solucao     TEXT NULL,
    criado_em             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_chamado_equipamento
        FOREIGN KEY (id_equipamento) REFERENCES equipamentos(id_equipamento),
    CONSTRAINT fk_chamado_local
        FOREIGN KEY (id_local) REFERENCES locais(id_local),
    CONSTRAINT fk_chamado_solicitante
        FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_chamado_responsavel
        FOREIGN KEY (id_responsavel_suporte) REFERENCES usuarios(id_usuario)
);

-- Log de alterações de status dos chamados
CREATE TABLE log_status_chamado (
    id_log          INT AUTO_INCREMENT PRIMARY KEY,
    id_chamado      INT NOT NULL,
    status_anterior ENUM('ABERTO','EM_ANALISE','CONCLUIDO') NULL,
    novo_status     ENUM('ABERTO','EM_ANALISE','CONCLUIDO') NOT NULL,
    alterado_por    INT NULL, -- opcional: usuário que fez a ação
    data_alteracao  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao      VARCHAR(255),

    CONSTRAINT fk_log_chamado
        FOREIGN KEY (id_chamado) REFERENCES chamados(id_chamado),
    CONSTRAINT fk_log_usuario
        FOREIGN KEY (alterado_por) REFERENCES usuarios(id_usuario)
);

-- =========================
-- VIEWS
-- =========================

-- View listando chamados em aberto (ABERTO ou EM_ANALISE) com dados principais
CREATE VIEW vw_chamados_abertos AS
SELECT
    c.id_chamado,
    c.data_abertura,
    c.status,
    e.descricao      AS equipamento,
    l.nome_local     AS local,
    u.nome           AS solicitante
FROM chamados c
JOIN equipamentos e ON e.id_equipamento = c.id_equipamento
JOIN locais       l ON l.id_local       = c.id_local
JOIN usuarios     u ON u.id_usuario     = c.id_solicitante
WHERE c.status IN ('ABERTO', 'EM_ANALISE');

-- View geral de detalhes do chamado
CREATE VIEW vw_detalhes_chamado AS
SELECT
    c.id_chamado,
    c.data_abertura,
    c.data_fechamento,
    c.status,
    c.descricao_problema,
    c.descricao_solucao,
    e.descricao      AS equipamento,
    l.nome_local     AS local,
    sol.nome         AS nome_solicitante,
    sup.nome         AS nome_responsavel_suporte
FROM chamados c
JOIN equipamentos e ON e.id_equipamento = c.id_equipamento
JOIN locais       l ON l.id_local       = c.id_local
JOIN usuarios   sol ON sol.id_usuario   = c.id_solicitante
LEFT JOIN usuarios sup ON sup.id_usuario = c.id_responsavel_suporte;

-- =========================
-- STORED PROCEDURES
-- =========================
DELIMITER $$

-- 1) Abrir um novo chamado
CREATE PROCEDURE sp_abrir_chamado (
    IN p_id_equipamento   INT,
    IN p_id_local         INT,
    IN p_id_solicitante   INT,
    IN p_descricao_problema TEXT
)
BEGIN
    INSERT INTO chamados (
        id_equipamento,
        id_local,
        id_solicitante,
        descricao_problema
    ) VALUES (
        p_id_equipamento,
        p_id_local,
        p_id_solicitante,
        p_descricao_problema
    );
END$$

-- 2) Atualizar status de um chamado (e opcionalmente registrar solução)
CREATE PROCEDURE sp_atualizar_status_chamado (
    IN p_id_chamado       INT,
    IN p_novo_status      ENUM('ABERTO','EM_ANALISE','CONCLUIDO'),
    IN p_descricao_solucao TEXT,
    IN p_id_responsavel   INT
)
BEGIN
    -- Atualiza o chamado
    UPDATE chamados
    SET status = p_novo_status,
        descricao_solucao = CASE 
            WHEN p_novo_status = 'CONCLUIDO' THEN p_descricao_solucao
            ELSE descricao_solucao
        END,
        id_responsavel_suporte = p_id_responsavel,
        data_fechamento = CASE
            WHEN p_novo_status = 'CONCLUIDO' THEN NOW()
            ELSE data_fechamento
        END
    WHERE id_chamado = p_id_chamado;
END$$

-- 3) Listar chamados em aberto (facilita uso pela aplicação)
CREATE PROCEDURE sp_listar_chamados_abertos ()
BEGIN
    SELECT * FROM vw_chamados_abertos;
END$$

-- 4) Obter detalhes completos de um chamado
CREATE PROCEDURE sp_obter_detalhes_chamado (
    IN p_id_chamado INT
)
BEGIN
    SELECT * 
    FROM vw_detalhes_chamado
    WHERE id_chamado = p_id_chamado;
END$$

-- =========================
-- TRIGGERS
-- =========================

-- Trigger para logar criação (status inicial ABERTO)
CREATE TRIGGER trg_chamado_after_insert
AFTER INSERT ON chamados
FOR EACH ROW
BEGIN
    INSERT INTO log_status_chamado (
        id_chamado,
        status_anterior,
        novo_status,
        alterado_por,
        observacao
    ) VALUES (
        NEW.id_chamado,
        NULL,
        NEW.status,
        NEW.id_solicitante,
        'Abertura do chamado'
    );
END$$

-- Trigger para logar mudanças de status
CREATE TRIGGER trg_chamado_after_update
AFTER UPDATE ON chamados
FOR EACH ROW
BEGIN
    IF (OLD.status <> NEW.status) THEN
        INSERT INTO log_status_chamado (
            id_chamado,
            status_anterior,
            novo_status,
            alterado_por,
            observacao
        ) VALUES (
            NEW.id_chamado,
            OLD.status,
            NEW.status,
            NEW.id_responsavel_suporte,
            'Alteração de status do chamado'
        );
    END IF;
END$$

DELIMITER ;

-- =========================
-- USUÁRIOS DE EXEMPLO
-- =========================

-- ATENÇÃO: em produção use hash real de senha (ex: bcrypt)
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES
('João Solicitante', 'joao@escola.com', 'senha123', 'SOLICITANTE'),
('Maria Suporte',    'maria@escola.com', 'senha123', 'SUPORTE');

-- Equipamentos e locais de exemplo
INSERT INTO equipamentos (descricao, numero_serie) VALUES
('Computador 1', 'PC-LAB1-001'),
('Impressora Sala dos Professores', 'IMP-PROF-010');

INSERT INTO locais (nome_local, descricao) VALUES
('Laboratório de Informática 1', 'Lab 1 - Bloco A'),
('Sala dos Professores', 'Sala anexa à coordenação');