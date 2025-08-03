import express from 'express';
import { config } from './config/env';
import { connectMongo } from './infrastructure/persistence/mongoose-connection';
import authRoutes from './interfaces/http/routes/auth.routes';

const app = express();
app.use(express.json());

connectMongo()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error', err));

app.use('/api/v1/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Nidify API');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
