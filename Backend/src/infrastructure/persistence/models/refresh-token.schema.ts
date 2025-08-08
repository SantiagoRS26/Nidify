import { Schema, model } from 'mongoose';
import { RefreshToken } from '../../../domain/models/refresh-token.model';
import { RefreshTokenStatus } from '../../../domain/models/enums/refresh-token-status.enum';

const RefreshTokenSchema = new Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, index: true },
    familyId: { type: String, required: true, index: true },
    token: { type: String, required: true },
    device: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date },
    status: {
      type: String,
      enum: Object.values(RefreshTokenStatus),
      required: true,
    },
  },
  { versionKey: false },
);

export const RefreshTokenModel = model<RefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
);
