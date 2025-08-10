import { Request, Response } from 'express';
import {
  CreateCategoryUseCase,
  CreateCategoryPayload,
} from '../../../application/use-cases/category/create-category.usecase';
import { ListCategoriesUseCase } from '../../../application/use-cases/category/list-categories.usecase';
import {
  UpdateCategoryUseCase,
  UpdateCategoryPayload,
} from '../../../application/use-cases/category/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/delete-category.usecase';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../dto/category.dto';
import { NotFoundError } from '../../../domain/errors/not-found.error';

export class CategoryController {
  constructor(
    private createCategory: CreateCategoryUseCase,
    private listCategories: ListCategoriesUseCase,
    private updateCategory: UpdateCategoryUseCase,
    private deleteCategory: DeleteCategoryUseCase,
  ) {}

  list = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const categories = await this.listCategories.execute(householdId);
    res.json({ categories });
  };

  create = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const payload = req.body as CreateCategoryRequestDto;
    const category = await this.createCategory.execute(
      householdId,
      payload as CreateCategoryPayload,
    );
    res.status(201).json({ category });
  };

  update = async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const payload = req.body as UpdateCategoryRequestDto;
    const category = await this.updateCategory.execute(
      categoryId,
      payload as UpdateCategoryPayload,
    );
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    res.json({ category });
  };

  delete = async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const category = await this.deleteCategory.execute(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    res.status(204).send();
  };
}
