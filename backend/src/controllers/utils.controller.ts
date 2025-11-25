export async function addEquipment(req: Request, res: Response) {
  const { descricao, numero_serie } = req.body;
  if (!descricao) {
    return res.status(400).json({ error: 'Descrição do equipamento é obrigatória.' });
  }
  try {
    const db = await getDbConnection();
    const [result]: any = await db.query(
      'INSERT INTO equipamentos (descricao, numero_serie) VALUES (?, ?)',
      [descricao, numero_serie || null]
    );
    return res.status(201).json({ message: 'Equipamento adicionado com sucesso', id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao adicionar equipamento', details: err });
  }
}

export async function addLocation(req: Request, res: Response) {
  const { nome_local, descricao } = req.body;
  if (!nome_local) {
    return res.status(400).json({ error: 'Nome do local é obrigatório.' });
  }
  try {
    const db = await getDbConnection();
    const [result]: any = await db.query(
      'INSERT INTO locais (nome_local, descricao) VALUES (?, ?)',
      [nome_local, descricao || null]
    );
    return res.status(201).json({ message: 'Local adicionado com sucesso', id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao adicionar local', details: err });
  }
}
import { Request, Response } from 'express';
import getDbConnection from '../config/database';

export async function listEquipments(req: Request, res: Response) {
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM equipamentos');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar equipamentos', details: err });
  }
}

export async function listLocations(req: Request, res: Response) {
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM locais');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar locais', details: err });
  }
}

export async function listLogs(req: Request, res: Response) {
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM log_status_chamado ORDER BY data_alteracao DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar logs', details: err });
  }
}
