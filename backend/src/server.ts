import getDbConnection from './config/database';
import app from './app';

const PORT = process.env.PORT || 3000;

getDbConnection()
  .then(() => {
    console.log('Conexão com banco de dados pronta.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('Erro ao conectar/criar banco de dados:', err);
    process.exit(1);
  });