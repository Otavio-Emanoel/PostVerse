import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DB_NAME = process.env.DB_NAME || 'suporte_ti_escola';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  multipleStatements: true,
};

async function ensureDatabase() {
  const connection = await mysql.createConnection(DB_CONFIG);
  // Verifica se o banco existe
  const [rows]: [any[], any] = await connection.query("SHOW DATABASES LIKE ?", [DB_NAME]);
  if (Array.isArray(rows) && rows.length === 0) {
    // Banco não existe, executa o script
    const sqlPath = path.join(__dirname, '../../database/suporte_ti_escola.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await connection.query(sql);
    console.log('Banco de dados criado com sucesso!');
  } else {
    console.log('Banco de dados já existe, conexão realizada.');
  }
  await connection.end();
}

async function getDbConnection() {
  await ensureDatabase();
  return mysql.createPool({
    ...DB_CONFIG,
    database: DB_NAME,
    connectionLimit: 1000, // Limita para evitar excesso de conexões
  });
}

export default getDbConnection;
