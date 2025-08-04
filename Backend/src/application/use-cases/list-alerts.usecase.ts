import { Alert } from '../../domain/models/alert.model';
import { AlertRepository } from '../../infrastructure/persistence/repositories/alert.repository';

export class ListAlertsUseCase {
  constructor(private repo: AlertRepository) {}

  async execute(userId: string, householdId: string): Promise<Alert[]> {
    return await this.repo.findByUser(userId, householdId);
  }
}
