import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CategoryService } from "../../../core/categories/category.service";
import { Category } from "../../../shared/models/category.model";
import { ItemsService } from "../../../core/items/items.service";
import { Item } from "../../../shared/models/item.model";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./categories.component.html",
  styleUrl: "./categories.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly itemsService = inject(ItemsService);

  readonly categories = this.categoryService.categories;

  readonly categoryForm = this.fb.nonNullable.group({
    name: ["", Validators.required],
    description: [""],
  });

  readonly editingId = signal<string | null>(null);
  readonly showDeleteModal = signal(false);
  readonly itemsToDelete = signal<Item[]>([]);
  readonly deletingCategory = signal<Category | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.categoryService.list().subscribe();
  }

  edit(cat: Category): void {
    this.editingId.set(cat.id);
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description ?? "",
    });
  }

  confirmDelete(cat: Category): void {
    this.deletingCategory.set(cat);
    this.itemsService
      .listByCategory(cat.id)
      .subscribe((items) => {
        this.itemsToDelete.set(items);
        this.showDeleteModal.set(true);
      });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingCategory.set(null);
    this.itemsToDelete.set([]);
  }

  deleteConfirmed(): void {
    const cat = this.deletingCategory();
    if (!cat) return;
    this.categoryService.delete(cat.id).subscribe(() => {
      this.cancelDelete();
    });
  }

  save(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    const data = this.categoryForm.getRawValue();
    const id = this.editingId();
    if (id) {
      this.categoryService.update(id, data).subscribe(() => {
        this.categoryForm.reset();
        this.editingId.set(null);
      });
    } else {
      this.categoryService.create(data).subscribe(() => {
        this.categoryForm.reset();
      });
    }
  }
}
