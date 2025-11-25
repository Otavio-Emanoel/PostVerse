import { Request, Response } from 'express';
import getDbConnection from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export async function register(req: Request, res: Response) {
  const { nome, email, senha, tipo_usuario } = req.body;
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha, tipo_usuario' });
  }
  try {
    const db = await getDbConnection();
    const hash = await bcrypt.hash(senha, 10);
    // Verifica se o e-mail já existe
    const [usuarios] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email]
    );
    if (Array.isArray(usuarios) && usuarios.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }
    const [result]: any = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?)',
      [nome, email, hash, tipo_usuario]
    );
    return res.status(201).json({ message: 'Usuário registrado com sucesso', id: result.insertId });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message || err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios: email, senha' });
  }
  try {
    const db = await getDbConnection();
    const [rows]: any = await db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      const usuario = rows[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      const token = jwt.sign({ id: usuario.id_usuario, tipo: usuario.tipo_usuario }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login realizado com sucesso', token });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao realizar login', details: err.message || err });
  }
}