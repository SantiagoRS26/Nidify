import { Schema, model, Document } from 'mongoose';
import { Invitation } from '../../../domain/models/invitation.model';
import { InvitationStatus } from '../../../domain/models/enums/invitation-status.enum';

interface InvitationDocument extends Document, Omit<Invitation, 'id'> {}

const InvitationSchema = new Schema<InvitationDocument>({
  householdId: { type: String, required: true },
  email: { type: String },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  status: {
    type: String,
    enum: Object.values(InvitationStatus),
    required: true,
  },
  invitedBy: { type: String, required: true },
  medium: { type: String },
  usageAttempts: { type: Number, default: 0 },
});

export const InvitationModel = model<InvitationDocument>(
  'Invitation',
  InvitationSchema,
);
