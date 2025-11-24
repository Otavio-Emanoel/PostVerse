import express from 'express';
import getDbConnection from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa conexão e garante banco criado
getDbConnection()
  .then(() => {
    console.log('Conexão com banco de dados pronta.');
  })
  .catch((err: any) => {
    console.error('Erro ao conectar/criar banco de dados:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});