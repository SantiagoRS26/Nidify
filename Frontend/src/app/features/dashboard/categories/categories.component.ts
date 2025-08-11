import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/categories/category.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  readonly editingId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.categoryService.list().subscribe((cats) => this.categories.set(cats));
  }

  edit(cat: Category): void {
    this.editingId.set(cat.id);
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description ?? '',
    });
  }

  save(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    const data = this.categoryForm.getRawValue();
    const id = this.editingId();
    if (id) {
      this.categoryService.update(id, data).subscribe((updated) => {
        this.categories.update((list) =>
          list.map((c) => (c.id === updated.id ? updated : c)),
        );
        this.categoryForm.reset();
        this.editingId.set(null);
      });
    } else {
      this.categoryService.create(data).subscribe((created) => {
        this.categories.update((list) => [...list, created]);
        this.categoryForm.reset();
      });
    }
  }
}
