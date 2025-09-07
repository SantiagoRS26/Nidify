import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
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
  private readonly categoriesSignal = signal<Category[]>([]);

  readonly categories = this.categoriesSignal.asReadonly();

  list(): Observable<Category[]> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .get<{ categories: Category[] }>(`/households/${householdId}/categories`)
      .pipe(
        map(({ categories }) => categories),
        tap((cats) => this.categoriesSignal.set(cats)),
      );
  }

  create(payload: CreateCategoryPayload): Observable<Category> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .post<{ category: Category }>(
        `/households/${householdId}/categories`,
        payload,
      )
      .pipe(
        map(({ category }) => category),
        tap((created) =>
          this.categoriesSignal.update((list) => [...list, created]),
        ),
      );
  }

  update(
    categoryId: string,
    payload: UpdateCategoryPayload,
  ): Observable<Category> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .put<{ category: Category }>(
        `/households/${householdId}/categories/${categoryId}`,
        payload,
      )
      .pipe(
        map(({ category }) => category),
        tap((updated) =>
          this.categoriesSignal.set(
            this.categoriesSignal().map((c) =>
              c.id === updated.id ? updated : c,
            ),
          ),
        ),
      );
  }

  delete(categoryId: string): Observable<void> {
    const householdId = this.household.getHouseholdId();
    return this.http
      .delete<void>(`/households/${householdId}/categories/${categoryId}`)
      .pipe(
        tap(() =>
          this.categoriesSignal.set(
            this.categoriesSignal().filter((c) => c.id !== categoryId),
          ),
        ),
      );
  }
}
