import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { AlertRepository } from '../../../infrastructure/persistence/repositories/alert.repository';
import { ListAlertsUseCase } from '../../../application/use-cases/alert/list-alerts.usecase';
import { MarkAlertReadUseCase } from '../../../application/use-cases/alert/mark-alert-read.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });

const repo = new AlertRepository();
const listAlerts = new ListAlertsUseCase(repo);
const markRead = new MarkAlertReadUseCase(repo);
const controller = new AlertController(listAlerts, markRead);

const jwtService = new JwtService();

router.get('/', authMiddleware(jwtService), controller.list);
router.put('/:alertId/read', authMiddleware(jwtService), controller.markRead);

export default router;
