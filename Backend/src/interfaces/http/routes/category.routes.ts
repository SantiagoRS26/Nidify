import { Router } from 'express';
import { CategoryRepository } from '../../../infrastructure/persistence/repositories/category.repository';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { CreateCategoryUseCase } from '../../../application/use-cases/category/create-category.usecase';
import { ListCategoriesUseCase } from '../../../application/use-cases/category/list-categories.usecase';
import { UpdateCategoryUseCase } from '../../../application/use-cases/category/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/delete-category.usecase';
import { CategoryController } from '../controllers/category.controller';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../dto/category.dto';

const router = Router({ mergeParams: true });

const categoryRepo = new CategoryRepository();
const itemRepo = new ItemRepository();
const jwtService = new JwtService();

const createCategory = new CreateCategoryUseCase(categoryRepo);
const listCategories = new ListCategoriesUseCase(categoryRepo);
const updateCategory = new UpdateCategoryUseCase(categoryRepo);
const deleteCategory = new DeleteCategoryUseCase(categoryRepo, itemRepo);

const controller = new CategoryController(
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
);

router.get('/', authMiddleware(jwtService), controller.list);
router.post(
  '/',
  authMiddleware(jwtService),
  validate({ body: createCategorySchema }),
  controller.create,
);
router.put(
  '/:categoryId',
  authMiddleware(jwtService),
  validate({ body: updateCategorySchema }),
  controller.update,
);
router.delete('/:categoryId', authMiddleware(jwtService), controller.delete);

export default router;
