import { NotificationPreferences } from '../../domain/models/notification-preferences.model';
import { NotificationPreferencesRepository } from '../../infrastructure/persistence/repositories/notification-preferences.repository';

export interface UpdateNotificationPreferencesPayload {
  alerts?: NotificationPreferences['alerts'];
  mediums?: string[];
  thresholds?: NotificationPreferences['thresholds'];
}

export class UpdateNotificationPreferencesUseCase {
  constructor(private repo: NotificationPreferencesRepository) {}

  async execute(
    userId: string,
    householdId: string,
    payload: UpdateNotificationPreferencesPayload,
  ): Promise<NotificationPreferences> {
    return await this.repo.upsert(
      userId,
      householdId,
      payload as Partial<NotificationPreferences>,
    );
  }
}
