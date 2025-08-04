import { Router } from 'express';
import { NotificationPreferencesController } from '../controllers/notification-preferences.controller';
import { NotificationPreferencesRepository } from '../../../infrastructure/persistence/repositories/notification-preferences.repository';
import { GetNotificationPreferencesUseCase } from '../../../application/use-cases/get-notification-preferences.usecase';
import { UpdateNotificationPreferencesUseCase } from '../../../application/use-cases/update-notification-preferences.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { notificationPreferencesSchema } from '../dto/notification-preferences.dto';

const router = Router({ mergeParams: true });

const repo = new NotificationPreferencesRepository();
const getPrefs = new GetNotificationPreferencesUseCase(repo);
const updatePrefs = new UpdateNotificationPreferencesUseCase(repo);
const controller = new NotificationPreferencesController(getPrefs, updatePrefs);

const jwtService = new JwtService();

router.get('/', authMiddleware(jwtService), controller.get);
router.put(
  '/',
  authMiddleware(jwtService),
  validate({ body: notificationPreferencesSchema }),
  controller.update,
);

export default router;
