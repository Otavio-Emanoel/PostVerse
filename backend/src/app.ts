
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import swaggerUi from 'swagger-ui-express';
import utilsRoutes from './routes/utils.routes';
import YAML from 'yamljs';
import path from 'path';

const swaggerPath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

const app = express();
app.use(cors());


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/utils', utilsRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
