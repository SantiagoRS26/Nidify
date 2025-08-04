import { NotificationPreferences } from '../../../domain/models/notification-preferences.model';
import { NotificationPreferencesModel } from '../models/notification-preferences.schema';

export class NotificationPreferencesRepository {
  async findByUserAndHousehold(
    userId: string,
    householdId: string,
  ): Promise<NotificationPreferences | null> {
    return (await NotificationPreferencesModel.findOne({
      userId,
      householdId,
    }).lean()) as NotificationPreferences | null;
  }

  async findByHousehold(
    householdId: string,
  ): Promise<NotificationPreferences[]> {
    return (await NotificationPreferencesModel.find({
      householdId,
    }).lean()) as NotificationPreferences[];
  }

  async upsert(
    userId: string,
    householdId: string,
    prefs: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    const updated = await NotificationPreferencesModel.findOneAndUpdate(
      { userId, householdId },
      { $set: prefs },
      { new: true, upsert: true },
    ).lean();
    return updated as NotificationPreferences;
  }
}
