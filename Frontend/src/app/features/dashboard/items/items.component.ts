import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CurrencyInputDirective } from "../../../shared/directives/currency-input.directive";
import { CurrencyFormatPipe } from "../../../shared/pipes/currency-format.pipe";
import { ItemsService } from "../../../core/items/items.service";
import { CategoryService } from "../../../core/categories/category.service";
import { Item } from "../../../shared/models/item.model";
import { ItemType } from "../../../shared/models/item-type.enum";
import { ItemPriority } from "../../../shared/models/item-priority.enum";
import { ItemStatus } from "../../../shared/models/item-status.enum";
import {
  ITEM_TYPE_LABELS,
  ITEM_PRIORITY_LABELS,
  ITEM_STATUS_LABELS,
} from "../../../shared/models/item-labels";
import { CurrencyService } from "../../../core/currency/currency.service";
import { AuthService } from "../../../core/auth/auth.service";
import { combineLatest, take } from "rxjs";
import { SplitModalComponent } from "./split-modal.component";
import { PaymentSplit } from "../../../shared/models/payment-split.model";
import { HouseholdService } from "../../../core/household/household.service";

type ItemFilter = 'all' | ItemType | ItemPriority;

@Component({
  selector: "app-items",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyInputDirective,
    CurrencyFormatPipe,
    SplitModalComponent,
  ],
  templateUrl: "./items.component.html",
  styleUrl: "./items.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly itemsService = inject(ItemsService);
  private readonly categoryService = inject(CategoryService);
  private readonly currencyService = inject(CurrencyService);
  private readonly authService = inject(AuthService);
  private readonly householdService = inject(HouseholdService);

  readonly items = signal<Item[]>([]);
  readonly categories = this.categoryService.categories;
  readonly categoryNameMap = computed(
    () =>
      new Map(
        this.categoryService
          .categories()
          .map((c) => [c.id, c.name] as const),
      ),
  );
  readonly currencies$ = this.currencyService.getSupported();

  private defaultCurrency = "USD";

  readonly members = signal<{ userId: string; label: string }[]>([]);

  readonly paymentSplit = signal<PaymentSplit | null>(null);

  readonly activeFilter = signal<ItemFilter>('all');

  readonly filteredItems = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return this.items();
    }
    if (filter === ItemType.ONE_TIME || filter === ItemType.RECURRING) {
      return this.items().filter((i) => i.type === filter);
    }
    return this.items().filter((i) => i.priority === filter);
  });

  readonly itemTypeOptions = Object.values(ItemType).map((value) => ({
    value,
    label: ITEM_TYPE_LABELS[value],
  }));

  readonly itemPriorityOptions = Object.values(ItemPriority).map((value) => ({
    value,
    label: ITEM_PRIORITY_LABELS[value],
  }));

  readonly itemStatusOptions = Object.values(ItemStatus).map((value) => ({
    value,
    label: ITEM_STATUS_LABELS[value],
  }));

  readonly ItemType = ItemType;
  readonly ItemPriority = ItemPriority;

  readonly itemForm = this.fb.nonNullable.group({
    name: ["", Validators.required],
    categoryId: [""],
    type: [ItemType.ONE_TIME, Validators.required],
    price: [0, Validators.required],
    currency: [this.defaultCurrency, Validators.required],
    priority: [ItemPriority.NECESSARY, Validators.required],
    status: [ItemStatus.TO_QUOTE, Validators.required],
    purchaseLink: [""],
  });

  showNewItemModal = signal(false);
  showSplitModal = signal(false);
  readonly editingId = signal<string | null>(null);

  constructor() {
    this.load();
    combineLatest([
      this.authService.user$.pipe(take(1)),
      this.householdService.getMembers(),
    ]).subscribe(([user, members]) => {
      if (user?.preferredCurrency) {
        this.defaultCurrency = user.preferredCurrency;
        this.itemForm.get("currency")?.setValue(this.defaultCurrency);
      }
      const currentId = user?.id;
      this.members.set(
        members.map((m, idx) => ({
          userId: m.userId,
          label:
            m.userId === currentId
              ? "Tú"
              : m.fullName ?? `Miembro ${idx + 1}`,
        })),
      );
      this.applyMemberLabels();
    });
  }

  load(): void {
    this.itemsService.list().subscribe((items) => {
      this.items.set(items);
      this.applyMemberLabels();
    });
    this.categoryService.list().subscribe();
  }

  setFilter(filter: ItemFilter): void {
    this.activeFilter.set(filter);
  }

  openNew(): void {
    this.editingId.set(null);
    this.itemForm.reset({
      name: "",
      categoryId: "",
      type: ItemType.ONE_TIME,
      price: 0,
      currency: this.defaultCurrency,
      priority: ItemPriority.NECESSARY,
      status: ItemStatus.TO_QUOTE,
      purchaseLink: "",
    });
    this.showNewItemModal.set(true);
    this.paymentSplit.set(null);
  }

  edit(item: Item): void {
    this.editingId.set(item.id);
    this.itemForm.patchValue({
      name: item.name,
      categoryId: item.categoryId ?? "",
      type: item.type,
      price: item.price,
      currency: item.currency,
      priority: item.priority,
      status: item.status,
      purchaseLink: item.purchaseLink ?? "",
    });
    this.showNewItemModal.set(true);
    this.paymentSplit.set(item.paymentSplit ?? null);
  }

  delete(item: Item): void {
    this.itemsService.delete(item.id).subscribe(() => {
      this.items.update((list) => list.filter((i) => i.id !== item.id));
    });
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
    const sum = split.assignments.reduce((acc, a) => acc + (a.amount ?? 0), 0);
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
      const backendSplit: PaymentSplit = {
        assignments: split.assignments.map((a) => ({
          userId: a.userId,
          label: a.label,
          percentage: a.percentage,
        })),
      };
      payload = { ...data, paymentSplit: backendSplit };
    }
    if (id) {
      this.itemsService.update(id, payload).subscribe((updated) => {
        this.items.update((list) =>
          list.map((i) => (i.id === updated.id ? updated : i))
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

  private applyMemberLabels(): void {
    const memberMap = new Map(this.members().map((m) => [m.userId, m.label]));
    this.items.update((items) =>
      items.map((item) =>
        item.paymentSplit
          ? {
              ...item,
              paymentSplit: {
                assignments: item.paymentSplit.assignments.map((a) => ({
                  ...a,
                  label: memberMap.get(a.userId) ?? a.label ?? a.userId,
                })),
              },
            }
          : item,
      ),
    );
    const split = this.paymentSplit();
    if (split) {
      this.paymentSplit.set({
        assignments: split.assignments.map((a) => ({
          ...a,
          label: memberMap.get(a.userId) ?? a.label ?? a.userId,
        })),
      });
    }
  }
}
