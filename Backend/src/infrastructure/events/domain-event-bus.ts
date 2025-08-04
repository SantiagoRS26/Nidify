import { EventEmitter } from 'events';
import { DomainEvent } from '../../domain/events/domain-event.interface';
import { DomainEventBus } from '../../domain/events/domain-event-bus.interface';

class InMemoryDomainEventBus implements DomainEventBus {
  private emitter = new EventEmitter();

  async publish(event: DomainEvent): Promise<void> {
    this.emitter.emit(event.type, event);
  }

  subscribe<T extends DomainEvent>(
    type: string,
    handler: (event: T) => Promise<void>,
  ): void {
    this.emitter.on(type, handler);
  }
}

export const domainEventBus = new InMemoryDomainEventBus();
