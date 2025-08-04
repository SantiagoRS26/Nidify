import { Schema, model, Document } from 'mongoose';
import { Alert } from '../../../domain/models/alert.model';
import { AlertType } from '../../../domain/models/enums/alert-type.enum';

interface AlertDocument extends Document, Omit<Alert, 'id'> {}

const AlertSchema = new Schema<AlertDocument>({
  userId: { type: String, required: true },
  householdId: { type: String },
  type: { type: String, enum: Object.values(AlertType), required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export const AlertModel = model<AlertDocument>('Alert', AlertSchema);
