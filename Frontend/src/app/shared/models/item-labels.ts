import { ItemType } from './item-type.enum';
import { ItemPriority } from './item-priority.enum';
import { ItemStatus } from './item-status.enum';

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  [ItemType.ONE_TIME]: 'Único',
  [ItemType.RECURRING]: 'Recurrente',
};

export const ITEM_PRIORITY_LABELS: Record<ItemPriority, string> = {
  [ItemPriority.NECESSARY]: 'Necesario',
  [ItemPriority.OPTIONAL]: 'Opcional',
  [ItemPriority.WHIM]: 'Capricho',
};

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  [ItemStatus.TO_QUOTE]: 'A cotizar',
  [ItemStatus.QUOTED]: 'Cotizado',
  [ItemStatus.PURCHASED]: 'Comprado',
  [ItemStatus.DISCARDED]: 'Descartado',
};

