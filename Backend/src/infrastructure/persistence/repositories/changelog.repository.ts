import { ChangelogEntry } from '../../../domain/models/changelog-entry.model';
import { ChangelogModel } from '../models/changelog-entry.schema';

export class ChangelogRepository {
  async findByHousehold(householdId: string): Promise<ChangelogEntry[]> {
    return (await ChangelogModel.find({ householdId })
      .sort({ timestamp: -1 })
      .lean()) as ChangelogEntry[];
  }

  async create(entry: Omit<ChangelogEntry, 'id'>): Promise<ChangelogEntry> {
    const created = await ChangelogModel.create(entry);
    return { id: created.id, ...created.toObject() } as ChangelogEntry;
  }
}
