import { Router } from 'express';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';
import { CategoryRepository } from '../../../infrastructure/persistence/repositories/category.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { CreateItemUseCase } from '../../../application/use-cases/create-item.usecase';
import { ListItemsUseCase } from '../../../application/use-cases/list-items.usecase';
import { UpdateItemUseCase } from '../../../application/use-cases/update-item.usecase';
import { DeleteItemUseCase } from '../../../application/use-cases/delete-item.usecase';
import { domainEventBus } from '../../../infrastructure/events/domain-event-bus';
import { ItemController } from '../controllers/item.controller';
import { createItemSchema, updateItemSchema } from '../dto/item.dto';

const router = Router({ mergeParams: true });

const itemRepo = new ItemRepository();
const categoryRepo = new CategoryRepository();
const jwtService = new JwtService();

const createItem = new CreateItemUseCase(
  itemRepo,
  categoryRepo,
  domainEventBus,
);
const listItems = new ListItemsUseCase(itemRepo);
const updateItem = new UpdateItemUseCase(
  itemRepo,
  categoryRepo,
  domainEventBus,
);
const deleteItem = new DeleteItemUseCase(itemRepo, domainEventBus);

const controller = new ItemController(
  createItem,
  listItems,
  updateItem,
  deleteItem,
);

router.get('/', authMiddleware(jwtService), controller.list);
router.post(
  '/',
  authMiddleware(jwtService),
  validate({ body: createItemSchema }),
  controller.create,
);
router.put(
  '/:itemId',
  authMiddleware(jwtService),
  validate({ body: updateItemSchema }),
  controller.update,
);
router.delete('/:itemId', authMiddleware(jwtService), controller.delete);

export default router;
