import { Item } from '../../domain/models/item.model';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';

export class DeleteItemUseCase {
  constructor(private itemRepo: ItemRepository) {}

  async execute(itemId: string): Promise<Item | null> {
    const item = await this.itemRepo.findById(itemId);
    if (!item) return null;
    await this.itemRepo.delete(itemId);
    return item;
  }
}
