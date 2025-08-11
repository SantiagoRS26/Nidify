import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from '../../../core/items/items.service';
import { CategoryService } from '../../../core/categories/category.service';
import { Item } from '../../../shared/models/item.model';
import { Category } from '../../../shared/models/category.model';
import { ItemType } from '../../../shared/models/item-type.enum';
import { ItemPriority } from '../../../shared/models/item-priority.enum';
import { ItemStatus } from '../../../shared/models/item-status.enum';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly itemsService = inject(ItemsService);
  private readonly categoryService = inject(CategoryService);

  readonly items = signal<Item[]>([]);
  readonly categories = signal<Category[]>([]);

  readonly itemTypes = Object.values(ItemType);
  readonly itemPriorities = Object.values(ItemPriority);
  readonly itemStatuses = Object.values(ItemStatus);

  readonly itemForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    categoryId: [''],
    type: [ItemType.ONE_TIME, Validators.required],
    price: [0, Validators.required],
    currency: ['USD', Validators.required],
    priority: [ItemPriority.NECESSARY, Validators.required],
    status: [ItemStatus.TO_QUOTE, Validators.required],
    purchaseLink: [''],
  });

  showNewItemModal = signal(false);
  showSplitModal = signal(false);
  readonly editingId = signal<string | null>(null);

  constructor() {
    this.load();
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
      currency: 'USD',
      priority: ItemPriority.NECESSARY,
      status: ItemStatus.TO_QUOTE,
      purchaseLink: '',
    });
    this.showNewItemModal.set(true);
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
  }

  getCategoryName(id?: string): string {
    const cat = this.categories().find((c) => c.id === id);
    return cat ? cat.name : '';
  }

  save(): void {
    if (this.itemForm.invalid) {
      return;
    }
    const data = this.itemForm.getRawValue();
    const id = this.editingId();
    if (id) {
      this.itemsService.update(id, data).subscribe((updated) => {
        this.items.update((list) =>
          list.map((i) => (i.id === updated.id ? updated : i)),
        );
        this.showNewItemModal.set(false);
      });
    } else {
      this.itemsService.create(data).subscribe((created) => {
        this.items.update((list) => [...list, created]);
        this.showNewItemModal.set(false);
      });
    }
  }
}
