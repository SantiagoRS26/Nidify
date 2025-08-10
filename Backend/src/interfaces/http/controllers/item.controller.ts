import { Request, Response } from 'express';
import {
  CreateItemUseCase,
  CreateItemPayload,
} from '../../../application/use-cases/item/create-item.usecase';
import { ListItemsUseCase } from '../../../application/use-cases/item/list-items.usecase';
import {
  UpdateItemUseCase,
  UpdateItemPayload,
} from '../../../application/use-cases/item/update-item.usecase';
import { DeleteItemUseCase } from '../../../application/use-cases/item/delete-item.usecase';
import { CreateItemRequestDto, UpdateItemRequestDto } from '../dto/item.dto';
import { notifyHousehold } from '../../../infrastructure/websocket/socket.service';
import { NotFoundError } from '../../../domain/errors/not-found.error';

interface AuthRequest extends Request {
  userId: string;
}

export class ItemController {
  constructor(
    private createItem: CreateItemUseCase,
    private listItems: ListItemsUseCase,
    private updateItem: UpdateItemUseCase,
    private deleteItem: DeleteItemUseCase,
  ) {}

  list = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const items = await this.listItems.execute(householdId);
    res.json({ items });
  };

  create = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const userId = (req as AuthRequest).userId;
    const payload = req.body as CreateItemRequestDto;
    const item = await this.createItem.execute(
      userId,
      householdId,
      payload as CreateItemPayload,
    );
    notifyHousehold(householdId, 'item:created', item);
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const userId = (req as AuthRequest).userId;
    const payload = req.body as UpdateItemRequestDto;
    const item = await this.updateItem.execute(
      userId,
      itemId,
      payload as UpdateItemPayload,
    );
    if (!item) {
      throw new NotFoundError('Item not found');
    }
    notifyHousehold(item.householdId, 'item:updated', item);
    res.json({ item });
  };

  delete = async (req: Request, res: Response) => {
    const { itemId } = req.params as { itemId: string };
    const userId = (req as AuthRequest).userId;
    const item = await this.deleteItem.execute(userId, itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }
    notifyHousehold(item.householdId, 'item:deleted', { id: itemId });
    res.status(204).send();
  };
}
