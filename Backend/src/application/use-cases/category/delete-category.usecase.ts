import { Category } from '../../../domain/models/category.model';
import { CategoryRepository } from '../../../infrastructure/persistence/repositories/category.repository';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';

export class DeleteCategoryUseCase {
  constructor(
    private categoryRepo: CategoryRepository,
    private itemRepo: ItemRepository,
  ) {}

  async execute(categoryId: string): Promise<Category | null> {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) return null;
    await this.categoryRepo.delete(categoryId);
    await this.itemRepo.deleteByCategory(categoryId);
    return category;
  }
}
