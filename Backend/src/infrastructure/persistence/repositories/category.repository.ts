import { Category } from '../../../domain/models/category.model';
import { CategoryModel } from '../models/category.schema';

export class CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return (await CategoryModel.findById(id).lean()) as Category | null;
  }

  async findByHousehold(householdId: string): Promise<Category[]> {
    return (await CategoryModel.find({ householdId }).lean()) as Category[];
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const created = await CategoryModel.create(category);
    return { id: created.id, ...created.toObject() } as unknown as Category;
  }

  async update(
    id: string,
    update: Partial<Category>,
  ): Promise<Category | null> {
    const updated = await CategoryModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    return updated as Category | null;
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }
}
