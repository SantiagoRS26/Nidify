import { Item } from '../../../domain/models/item.model';
import { ItemModel } from '../models/item.schema';

export class ItemRepository {
  async findById(id: string): Promise<Item | null> {
    const doc = await ItemModel.findById(id).lean();
    return doc ? ({ id: doc._id.toString(), ...doc } as unknown as Item) : null;
  }

  async findByHousehold(householdId: string): Promise<Item[]> {
    const docs = await ItemModel.find({ householdId }).lean();
    return docs.map(
      (doc) => ({ id: doc._id.toString(), ...doc }) as unknown as Item,
    );
  }

  async create(item: Omit<Item, 'id'>): Promise<Item> {
    const created = await ItemModel.create(item);
    return { id: created.id, ...created.toObject() } as unknown as Item;
  }

  async update(id: string, update: Partial<Item>): Promise<Item | null> {
    const updated = await ItemModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    return updated
      ? ({ id: updated._id.toString(), ...updated } as unknown as Item)
      : null;
  }

  async delete(id: string): Promise<void> {
    await ItemModel.findByIdAndDelete(id);
  }

  async deleteByCategory(categoryId: string): Promise<void> {
    await ItemModel.deleteMany({ categoryId });
  }
}
