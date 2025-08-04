import { DomainEvent } from './domain-event.interface';
import { Item } from '../models/item.model';

export interface ItemCreatedEvent extends DomainEvent {
  type: 'ItemCreated';
  householdId: string;
  item: Item;
  userId: string;
  userName?: string;
}

export interface ItemUpdatedEvent extends DomainEvent {
  type: 'ItemUpdated';
  householdId: string;
  before: Item;
  after: Item;
  userId: string;
  userName?: string;
}

export interface ItemDeletedEvent extends DomainEvent {
  type: 'ItemDeleted';
  householdId: string;
  item: Item;
  userId: string;
  userName?: string;
}
