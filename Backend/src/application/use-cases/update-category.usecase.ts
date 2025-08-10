import { Category } from '../../domain/models/category.model';
import { CategoryRepository } from '../../infrastructure/persistence/repositories/category.repository';

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  order?: number;
  isBase?: boolean;
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(
    categoryId: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category | null> {
    return this.categoryRepo.update(categoryId, {
      ...payload,
      updatedAt: new Date(),
    });
  }
}
