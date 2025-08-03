import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';

export class DeleteItemUseCase {
  constructor(private itemRepo: ItemRepository) {}

  async execute(itemId: string): Promise<void> {
    await this.itemRepo.delete(itemId);
  }
}
