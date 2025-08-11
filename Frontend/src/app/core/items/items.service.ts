import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HouseholdService } from '../household/household.service';
import { Item } from '../../shared/models/item.model';

export type CreateItemPayload = Partial<
  Pick<
    Item,
    | 'name'
    | 'description'
    | 'categoryId'
    | 'type'
    | 'price'
    | 'currency'
    | 'priority'
    | 'status'
    | 'purchaseLink'
    | 'paymentSplit'
  >
>;

export type UpdateItemPayload = CreateItemPayload;

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdService);

  list(): Observable<Item[]> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .get<{ items: Item[] }>(`/households/${householdId}/items`)
      .pipe(map(({ items }) => items));
  }

  create(payload: CreateItemPayload): Observable<Item> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .post<{ item: Item }>(`/households/${householdId}/items`, payload)
      .pipe(map(({ item }) => item));
  }

  update(itemId: string, payload: UpdateItemPayload): Observable<Item> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .put<{ item: Item }>(
        `/households/${householdId}/items/${itemId}`,
        payload,
      )
      .pipe(map(({ item }) => item));
  }
}
