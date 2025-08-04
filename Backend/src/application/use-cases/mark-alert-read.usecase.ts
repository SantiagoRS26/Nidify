import { Alert } from '../../domain/models/alert.model';
import { AlertRepository } from '../../infrastructure/persistence/repositories/alert.repository';

export class MarkAlertReadUseCase {
  constructor(private repo: AlertRepository) {}

  async execute(id: string, userId: string): Promise<Alert | null> {
    return await this.repo.markRead(id, userId);
  }
}
