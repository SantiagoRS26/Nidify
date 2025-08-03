import { Schema, model, Document } from 'mongoose';
import { UserStatus } from '../../../domain/models/enums/user-status.enum';
import { User } from '../../../domain/models/user.model';

interface UserDocument extends Document, Omit<User, 'id'> {}

const OAuthProviderSchema = new Schema({
  provider: { type: String, required: true },
  externalId: { type: String, required: true },
  linkedAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<UserDocument>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  oauthProviders: { type: [OAuthProviderSchema], default: [] },
  preferredCurrency: { type: String },
  locale: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
  },
});

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const UserModel = model<UserDocument>('User', UserSchema);
