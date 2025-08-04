import { Alert } from '../../../domain/models/alert.model';
import { AlertModel } from '../models/alert.schema';

export class AlertRepository {
  async create(alert: Omit<Alert, 'id'>): Promise<Alert> {
    const created = await AlertModel.create(alert);
    return { id: created.id, ...created.toObject() } as unknown as Alert;
  }

  async findByUser(userId: string, householdId?: string): Promise<Alert[]> {
    const query: Record<string, unknown> = { userId };
    if (householdId) query.householdId = householdId;
    return (await AlertModel.find(query)
      .sort({ createdAt: -1 })
      .lean()) as Alert[];
  }

  async markRead(id: string, userId: string): Promise<Alert | null> {
    return (await AlertModel.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true },
    ).lean()) as Alert | null;
  }
}
