import { Schema, model, Document } from 'mongoose';
import { ChangelogEntry } from '../../../domain/models/changelog-entry.model';
import { ChangelogEntityType } from '../../../domain/models/enums/changelog-entity-type.enum';
import { ChangelogChangeType } from '../../../domain/models/enums/changelog-change-type.enum';

interface ChangelogDocument extends Document, Omit<ChangelogEntry, 'id'> {}

const ChangelogSchema = new Schema<ChangelogDocument>({
  householdId: { type: String, required: true },
  entityType: {
    type: String,
    enum: Object.values(ChangelogEntityType),
    required: true,
  },
  entityId: { type: String, required: true },
  changeType: {
    type: String,
    enum: Object.values(ChangelogChangeType),
    required: true,
  },
  description: { type: String, required: true },
  diff: { type: Schema.Types.Mixed },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

export const ChangelogModel = model<ChangelogDocument>(
  'Changelog',
  ChangelogSchema,
);
