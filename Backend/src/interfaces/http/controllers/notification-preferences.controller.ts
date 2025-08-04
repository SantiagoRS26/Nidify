import { Request, Response } from 'express';
import { GetNotificationPreferencesUseCase } from '../../../application/use-cases/get-notification-preferences.usecase';
import {
  UpdateNotificationPreferencesUseCase,
  UpdateNotificationPreferencesPayload,
} from '../../../application/use-cases/update-notification-preferences.usecase';
import { NotificationPreferencesDto } from '../dto/notification-preferences.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class NotificationPreferencesController {
  constructor(
    private getPrefs: GetNotificationPreferencesUseCase,
    private updatePrefs: UpdateNotificationPreferencesUseCase,
  ) {}

  get = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const userId = (req as AuthRequest).userId;
    const prefs = await this.getPrefs.execute(userId, householdId);
    res.json({ preferences: prefs });
  };

  update = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const userId = (req as AuthRequest).userId;
    const payload = req.body as NotificationPreferencesDto;
    await this.updatePrefs.execute(
      userId,
      householdId,
      payload as UpdateNotificationPreferencesPayload,
    );
    res.status(204).send();
  };
}
