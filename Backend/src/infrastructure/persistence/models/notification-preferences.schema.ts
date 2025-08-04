import { Schema, model, Document } from 'mongoose';
import { NotificationPreferences } from '../../../domain/models/notification-preferences.model';

interface NotificationPreferencesDocument
  extends Document,
    Omit<NotificationPreferences, 'id'> {}

const AlertsSchema = new Schema({
  budgetExceeded: { type: Boolean, default: false },
  monthlyServiceReminder: { type: Boolean, default: false },
});

const ThresholdsSchema = new Schema({
  budgetUsage: { type: Number },
});

const NotificationPreferencesSchema =
  new Schema<NotificationPreferencesDocument>({
    userId: { type: String, required: true },
    householdId: { type: String },
    alerts: { type: AlertsSchema, default: {} },
    mediums: { type: [String], default: ['in_app'] },
    thresholds: { type: ThresholdsSchema },
  });

export const NotificationPreferencesModel =
  model<NotificationPreferencesDocument>(
    'NotificationPreferences',
    NotificationPreferencesSchema,
  );
