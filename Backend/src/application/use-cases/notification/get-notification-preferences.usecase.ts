import { NotificationPreferences } from '../../../domain/models/notification-preferences.model';
import { NotificationPreferencesRepository } from '../../../infrastructure/persistence/repositories/notification-preferences.repository';

export class GetNotificationPreferencesUseCase {
  constructor(private repo: NotificationPreferencesRepository) {}

  async execute(
    userId: string,
    householdId: string,
  ): Promise<NotificationPreferences> {
    const prefs = await this.repo.findByUserAndHousehold(userId, householdId);
    if (prefs) return prefs;
    return {
      id: '',
      userId,
      householdId,
      alerts: { budgetExceeded: true },
      mediums: ['in_app'],
    };
  }
}
