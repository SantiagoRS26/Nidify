import { Item } from '../../../domain/models/item.model';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';

export class ListItemsUseCase {
  constructor(private itemRepo: ItemRepository) {}

  async execute(householdId: string): Promise<Item[]> {
    return this.itemRepo.findByHousehold(householdId);
  }
}
