import { Request, Response } from 'express';
import getDbConnection from '../config/database';

export async function getPosts(req: Request, res: Response) {
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM chamados');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar posts', details: err });
  }
}

export async function getPostById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM chamados WHERE id_chamado = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return res.json(rows[0]);
    } else {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar post', details: err });
  }
}

export async function createPost(req: Request, res: Response) {
  const { id_equipamento, id_local, id_solicitante, descricao_problema } = req.body;
  if (!id_equipamento || !id_local || !id_solicitante || !descricao_problema) {
    return res.status(400).json({ error: 'Campos obrigatórios: id_equipamento, id_local, id_solicitante, descricao_problema' });
  }
  try {
    const db = await getDbConnection();
    const [result]: any = await db.query(
      'INSERT INTO chamados (id_equipamento, id_local, id_solicitante, descricao_problema) VALUES (?, ?, ?, ?)',
      [id_equipamento, id_local, id_solicitante, descricao_problema]
    );
    return res.status(201).json({ message: 'Post criado com sucesso', id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar post', details: err });
  }
}

export async function updatePost(req: Request, res: Response) {
  const { id } = req.params;
  const { descricao_problema, status, descricao_solucao } = req.body;
  try {
    const db = await getDbConnection();
    let query = '';
    let params: any[] = [];
    if (status === 'CONCLUIDO') {
      query = 'UPDATE chamados SET descricao_problema = ?, status = ?, descricao_solucao = ?, data_fechamento = NOW() WHERE id_chamado = ?';
      params = [descricao_problema, status, descricao_solucao, id];
    } else {
      query = 'UPDATE chamados SET descricao_problema = ?, status = ?, descricao_solucao = ?, data_fechamento = NULL WHERE id_chamado = ?';
      params = [descricao_problema, status, descricao_solucao, id];
    }
    const [result]: any = await db.query(query, params);
    if (result.affectedRows > 0) {
      return res.json({ message: 'Post atualizado com sucesso' });
    } else {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar post', details: err });
  }
}

export async function deletePost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const db = await getDbConnection();
    const [result]: any = await db.query('DELETE FROM chamados WHERE id_chamado = ?', [id]);
    if (result.affectedRows > 0) {
      return res.json({ message: 'Post excluído com sucesso' });
    } else {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir post', details: err });
  }
}
