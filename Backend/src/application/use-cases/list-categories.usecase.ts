import { Category } from '../../domain/models/category.model';
import { CategoryRepository } from '../../infrastructure/persistence/repositories/category.repository';

export class ListCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(householdId: string): Promise<Category[]> {
    return this.categoryRepo.findByHousehold(householdId);
  }
}
