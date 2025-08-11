import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: "app-budget",
  standalone: true,
  imports: [CommonModule, CurrencyInputDirective],
  templateUrl: "./budget.component.html",
  styleUrl: "./budget.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent {
  showEditBudget = signal(false);
}
