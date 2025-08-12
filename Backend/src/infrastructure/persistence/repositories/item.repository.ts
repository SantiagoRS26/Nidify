import { Item } from '../../../domain/models/item.model';
import { ItemModel } from '../models/item.schema';

export class ItemRepository {
  async findById(id: string): Promise<Item | null> {
    const doc = await ItemModel.findById(id).lean();
    if (!doc) return null;
    const { _id, ...data } = doc as {
      _id: unknown;
    } & Record<string, unknown>;
    return { id: String(_id), ...data } as Item;
  }

  async findByHousehold(householdId: string): Promise<Item[]> {
    const docs = await ItemModel.find({ householdId }).lean();
    return docs.map((doc) => {
      const { _id, ...data } = doc as {
        _id: unknown;
      } & Record<string, unknown>;
      return { id: String(_id), ...data } as Item;
    });
  }

  async create(item: Omit<Item, 'id'>): Promise<Item> {
    const created = await ItemModel.create(item);
    return { id: created.id, ...created.toObject() } as unknown as Item;
  }

  async update(id: string, update: Partial<Item>): Promise<Item | null> {
    const updated = await ItemModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    if (!updated) return null;
    const { _id, ...data } = updated as {
      _id: unknown;
    } & Record<string, unknown>;
    return { id: String(_id), ...data } as Item;
  }

  async delete(id: string): Promise<void> {
    await ItemModel.findByIdAndDelete(id);
  }

  async deleteByCategory(categoryId: string): Promise<void> {
    await ItemModel.deleteMany({ categoryId });
  }
}
