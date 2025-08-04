import { DomainEvent } from './domain-event.interface';

export interface DomainEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    type: string,
    handler: (event: T) => Promise<void>,
  ): void;
}
