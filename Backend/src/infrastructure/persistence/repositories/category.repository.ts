import { Category } from '../../../domain/models/category.model';
import { CategoryModel } from '../models/category.schema';

export class CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const doc = await CategoryModel.findById(id).lean();
    if (!doc) return null;
    const { _id, ...data } = doc as {
      _id: unknown;
    } & Record<string, unknown>;
    return { id: String(_id), ...data } as Category;
  }

  async findByHousehold(householdId: string): Promise<Category[]> {
    const docs = await CategoryModel.find({ householdId }).lean();
    return docs.map((doc) => {
      const { _id, ...data } = doc as {
        _id: unknown;
      } & Record<string, unknown>;
      return { id: String(_id), ...data } as Category;
    });
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
