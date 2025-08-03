import express from 'express';
import { config } from './config/env';
import { connectMongo } from './infrastructure/persistence/mongoose-connection';
import authRoutes from './interfaces/http/routes/auth.routes';

const app = express();
app.use(express.json());

connectMongo()
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión con MongoDB', err));

app.use('/api/v1/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('API de Nidify');
});

app.listen(config.port, () => {
  console.log(`Servidor ejecutándose en el puerto ${config.port}`);
});
