import { BudgetChange } from '../../../domain/models/budget-change.model';
import { BudgetChangeModel } from '../models/budget-change.schema';

export class BudgetChangeRepository {
  async create(change: Omit<BudgetChange, 'id'>): Promise<BudgetChange> {
    const created = await BudgetChangeModel.create(change);
    return { id: created.id, ...created.toObject() } as unknown as BudgetChange;
  }

  async findByHousehold(householdId: string): Promise<BudgetChange[]> {
    return (await BudgetChangeModel.find({ householdId })
      .sort({ timestamp: -1 })
      .lean()) as BudgetChange[];
  }
}
