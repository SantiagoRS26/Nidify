import { Household } from '../../../domain/models/household.model';
import { HouseholdModel } from '../models/household.schema';

export class HouseholdRepository {
  async create(household: Omit<Household, 'id'>): Promise<Household> {
    const created = await HouseholdModel.create(household);
    return { id: created.id, ...created.toObject() } as unknown as Household;
  }

  async findById(id: string): Promise<Household | null> {
    return (await HouseholdModel.findById(id).lean()) as Household | null;
  }

  async update(
    id: string,
    update: Partial<Household>,
  ): Promise<Household | null> {
    const updated = await HouseholdModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    return updated as Household | null;
  }
}
