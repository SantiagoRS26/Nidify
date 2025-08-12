import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HouseholdService } from '../household/household.service';
import { Category } from '../../shared/models/category.model';

export type CreateCategoryPayload = Partial<
  Pick<Category, 'name' | 'description'>
>;
export type UpdateCategoryPayload = CreateCategoryPayload;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly household = inject(HouseholdService);

  list(): Observable<Category[]> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .get<{ categories: Category[] }>(`/households/${householdId}/categories`)
      .pipe(map(({ categories }) => categories));
  }

  create(payload: CreateCategoryPayload): Observable<Category> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .post<{ category: Category }>(
        `/households/${householdId}/categories`,
        payload,
      )
      .pipe(map(({ category }) => category));
  }

  update(categoryId: string, payload: UpdateCategoryPayload): Observable<Category> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .put<{ category: Category }>(
        `/households/${householdId}/categories/${categoryId}`,
        payload,
      )
      .pipe(map(({ category }) => category));
  }

  delete(categoryId: string): Observable<Category> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .delete<{ category: Category }>(
        `/households/${householdId}/categories/${categoryId}`,
      )
      .pipe(map(({ category }) => category));
  }
}
