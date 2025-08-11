import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ItemsService } from '../../../core/items/items.service';
import { CategoryService } from '../../../core/categories/category.service';
import { Item } from '../../../shared/models/item.model';
import { Category } from '../../../shared/models/category.model';
import { ItemType } from '../../../shared/models/item-type.enum';
import { ItemPriority } from '../../../shared/models/item-priority.enum';
import { ItemStatus } from '../../../shared/models/item-status.enum';
import {
  ITEM_TYPE_LABELS,
  ITEM_PRIORITY_LABELS,
  ITEM_STATUS_LABELS,
} from '../../../shared/models/item-labels';
import { CurrencyService } from '../../../core/currency/currency.service';
import { AuthService } from '../../../core/auth/auth.service';
import { take } from 'rxjs';
import { SplitModalComponent } from './split-modal.component';
import { PaymentSplit } from '../../../shared/models/payment-split.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyInputDirective,
    CurrencyFormatPipe,
    SplitModalComponent,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly itemsService = inject(ItemsService);
  private readonly categoryService = inject(CategoryService);
  private readonly currencyService = inject(CurrencyService);
  private readonly authService = inject(AuthService);

  readonly items = signal<Item[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly currencies$ = this.currencyService.getSupported();

  private defaultCurrency = 'USD';

  readonly members = [
    { userId: 'me', label: 'Tú' },
    { userId: 'partner', label: 'Pareja' },
  ];

  readonly paymentSplit = signal<PaymentSplit | null>(null);

  readonly itemTypeOptions = Object.values(ItemType).map((value) => ({
    value,
    label: ITEM_TYPE_LABELS[value],
  }));

  readonly itemPriorityOptions = Object.values(ItemPriority).map(
    (value) => ({
      value,
      label: ITEM_PRIORITY_LABELS[value],
    }),
  );

  readonly itemStatusOptions = Object.values(ItemStatus).map((value) => ({
    value,
    label: ITEM_STATUS_LABELS[value],
  }));

  readonly itemForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    categoryId: [''],
    type: [ItemType.ONE_TIME, Validators.required],
    price: [0, Validators.required],
    currency: [this.defaultCurrency, Validators.required],
    priority: [ItemPriority.NECESSARY, Validators.required],
    status: [ItemStatus.TO_QUOTE, Validators.required],
    purchaseLink: [''],
  });

  showNewItemModal = signal(false);
  showSplitModal = signal(false);
  readonly editingId = signal<string | null>(null);

  constructor() {
    this.load();
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user?.preferredCurrency) {
        this.defaultCurrency = user.preferredCurrency;
        this.itemForm.get('currency')?.setValue(this.defaultCurrency);
      }
    });
  }

  load(): void {
    this.itemsService.list().subscribe((items) => this.items.set(items));
    this.categoryService.list().subscribe((cats) => this.categories.set(cats));
  }

  openNew(): void {
    this.editingId.set(null);
    this.itemForm.reset({
      name: '',
      categoryId: '',
      type: ItemType.ONE_TIME,
      price: 0,
      currency: this.defaultCurrency,
      priority: ItemPriority.NECESSARY,
      status: ItemStatus.TO_QUOTE,
      purchaseLink: '',
    });
    this.showNewItemModal.set(true);
    this.paymentSplit.set(null);
  }

  edit(item: Item): void {
    this.editingId.set(item.id);
    this.itemForm.patchValue({
      name: item.name,
      categoryId: item.categoryId ?? '',
      type: item.type,
      price: item.price,
      currency: item.currency,
      priority: item.priority,
      status: item.status,
      purchaseLink: item.purchaseLink ?? '',
    });
    this.showNewItemModal.set(true);
    this.paymentSplit.set(item.paymentSplit ?? null);
  }

  getCategoryName(id?: string): string {
    const cat = this.categories().find((c) => c.id === id);
    return cat ? cat.name : '';
  }

  getStatusLabel(status: ItemStatus): string {
    return ITEM_STATUS_LABELS[status];
  }

  getPriorityLabel(priority: ItemPriority): string {
    return ITEM_PRIORITY_LABELS[priority];
  }

  openSplit(): void {
    this.showSplitModal.set(true);
  }

  onSplitSave(split: PaymentSplit): void {
    this.paymentSplit.set(split);
    this.showSplitModal.set(false);
  }

  private recalcSplit(split: PaymentSplit, total: number): PaymentSplit {
    return {
      assignments: split.assignments.map((a) => {
        const amount = a.amount ?? ((a.percentage ?? 0) / 100) * total;
        const percentage = a.percentage ?? (total ? (amount / total) * 100 : 0);
        return {
          ...a,
          amount,
          percentage,
          calculatedAmount: amount,
        };
      }),
    };
  }

  private isSplitValid(split: PaymentSplit, total: number): boolean {
    const sum = split.assignments.reduce(
      (acc, a) => acc + (a.amount ?? 0),
      0,
    );
    return Math.round(sum * 100) === Math.round(total * 100);
  }

  save(): void {
    if (this.itemForm.invalid) {
      return;
    }
    const data = this.itemForm.getRawValue();
    data.price = Number(data.price);
    const id = this.editingId();
    let payload: any = data;
    if (this.paymentSplit()) {
      const split = this.recalcSplit(this.paymentSplit()!, data.price);
      if (!this.isSplitValid(split, data.price)) {
        return;
      }
      payload = { ...data, paymentSplit: split };
    }
    if (id) {
      this.itemsService.update(id, payload).subscribe((updated) => {
        this.items.update((list) =>
          list.map((i) => (i.id === updated.id ? updated : i)),
        );
        this.showNewItemModal.set(false);
      });
    } else {
      this.itemsService.create(payload).subscribe((created) => {
        this.items.update((list) => [...list, created]);
        this.showNewItemModal.set(false);
      });
    }
  }
}
