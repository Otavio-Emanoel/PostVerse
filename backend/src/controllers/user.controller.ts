import { Request, Response } from 'express';
import getDbConnection from '../config/database';

export async function getMe(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT id_usuario, nome, email, tipo_usuario, ativo, criado_em FROM usuarios WHERE id_usuario = ?', [user.id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return res.json(rows[0]);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuário', details: err });
  }
}

export async function getUserPosts(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM chamados WHERE id_solicitante = ?', [id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar posts do usuário', details: err });
  }
}
