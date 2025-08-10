import { Request, Response } from 'express';
import { ListAlertsUseCase } from '../../../application/use-cases/alert/list-alerts.usecase';
import { MarkAlertReadUseCase } from '../../../application/use-cases/alert/mark-alert-read.usecase';
import { NotFoundError } from '../../../domain/errors/not-found.error';

interface AuthRequest extends Request {
  userId: string;
}

export class AlertController {
  constructor(
    private listAlertsUseCase: ListAlertsUseCase,
    private markAlertReadUseCase: MarkAlertReadUseCase,
  ) {}

  list = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const userId = (req as AuthRequest).userId;
    const alerts = await this.listAlertsUseCase.execute(userId, householdId);
    res.json({ alerts });
  };

  markRead = async (req: Request, res: Response) => {
    const { alertId } = req.params as { alertId: string };
    const userId = (req as AuthRequest).userId;
    const alert = await this.markAlertReadUseCase.execute(alertId, userId);
    if (!alert) {
      throw new NotFoundError('Alert not found');
    }
    res.json({ alert });
  };
}
