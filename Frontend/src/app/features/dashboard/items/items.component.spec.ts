import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ItemsComponent } from './items.component';
import { ItemsService } from '../../../core/items/items.service';
import { CategoryService } from '../../../core/categories/category.service';
import { CurrencyService } from '../../../core/currency/currency.service';
import { AuthService } from '../../../core/auth/auth.service';
import { HouseholdService } from '../../../core/household/household.service';
import { signal } from '@angular/core';
import { Category } from '../../../shared/models/category.model';
import { Item } from '../../../shared/models/item.model';
import { ItemPriority } from '../../../shared/models/item-priority.enum';
import { ItemStatus } from '../../../shared/models/item-status.enum';
import { ItemType } from '../../../shared/models/item-type.enum';

class MockItemsService {
  list() {
    return of([]);
  }
  create() {
    return of();
  }
  update() {
    return of();
  }
  delete() {
    return of();
  }
}

class MockCategoryService {
  categoriesSignal = signal<Category[]>([]);
  categories = this.categoriesSignal.asReadonly();
  list() {
    return of([]);
  }
  update(id: string, payload: Partial<Category>) {
    this.categoriesSignal.update((list) =>
      list.map((c) => (c.id === id ? { ...c, ...payload } : c)),
    );
    const updated = this.categoriesSignal().find((c) => c.id === id)!;
    return of(updated);
  }
}

class MockCurrencyService {
  getSupported() {
    return of([]);
  }
}

class MockAuthService {
  user$ = of({ id: 'user1', preferredCurrency: 'USD' });
}

class MockHouseholdService {
  getMembers() {
    return of([]);
  }
  getHouseholdId() {
    return 'h1';
  }
}

describe('ItemsComponent categoryNameMap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemsComponent],
      providers: [
        { provide: ItemsService, useClass: MockItemsService },
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: HouseholdService, useClass: MockHouseholdService },
      ],
    });
  });

  it('updates categoryNameMap when a category is edited', () => {
    const fixture = TestBed.createComponent(ItemsComponent);
    const component = fixture.componentInstance;
    const categoryService = TestBed.inject(CategoryService) as unknown as MockCategoryService;

    categoryService.categoriesSignal.set([
      {
        id: 'cat1',
        householdId: 'h1',
        name: 'Old',
        createdAt: '',
        updatedAt: '',
      },
    ]);

    const item: Item = {
      id: 'item1',
      householdId: 'h1',
      name: 'Test',
      categoryId: 'cat1',
      type: ItemType.ONE_TIME,
      price: 0,
      currency: 'USD',
      status: ItemStatus.TO_QUOTE,
      priority: ItemPriority.NECESSARY,
      createdAt: '',
      updatedAt: '',
      lastModifiedBy: 'user1',
    };

    expect(component.categoryNameMap().get(item.categoryId!)).toBe('Old');

    categoryService.update('cat1', { name: 'New' }).subscribe();

    expect(component.categoryNameMap().get(item.categoryId!)).toBe('New');
  });
});
