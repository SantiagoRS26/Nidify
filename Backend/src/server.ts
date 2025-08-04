import express from 'express';
import http from 'http';
import { config } from './config/env';
import { connectMongo } from './infrastructure/persistence/mongoose-connection';
import authRoutes from './interfaces/http/routes/auth.routes';
import householdRoutes from './interfaces/http/routes/household.routes';
import invitationRoutes from './interfaces/http/routes/invitation.routes';
import itemRoutes from './interfaces/http/routes/item.routes';
import budgetRoutes from './interfaces/http/routes/budget.routes';
import currencyRoutes from './interfaces/http/routes/currency.routes';
import changelogRoutes from './interfaces/http/routes/changelog.routes';
import { initSocket } from './infrastructure/websocket/socket.service';
import './infrastructure/events/changelog.subscriber';

const app = express();
app.use(express.json());

const server = http.createServer(app);
initSocket(server);

connectMongo()
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión con MongoDB', err));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/households', householdRoutes);
app.use('/api/v1/invitations', invitationRoutes);
app.use('/api/v1/households/:householdId/items', itemRoutes);
app.use('/api/v1/households/:householdId/budget', budgetRoutes);
app.use('/api/v1/households/:householdId/changelog', changelogRoutes);
app.use('/api/v1/currency', currencyRoutes);

app.get('/', (_req, res) => {
  res.send('API de Nidify');
});

server.listen(config.port, () => {
  console.log(`Servidor ejecutándose en el puerto ${config.port}`);
});
