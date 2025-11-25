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
