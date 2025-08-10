import { Category } from '../../domain/models/category.model';
import { CategoryRepository } from '../../infrastructure/persistence/repositories/category.repository';

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  order?: number;
  isBase?: boolean;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(
    householdId: string,
    payload: CreateCategoryPayload,
  ): Promise<Category> {
    const now = new Date();
    const category: Omit<Category, 'id'> = {
      householdId,
      ...payload,
      createdAt: now,
      updatedAt: now,
    };
    return this.categoryRepo.create(category);
  }
}
