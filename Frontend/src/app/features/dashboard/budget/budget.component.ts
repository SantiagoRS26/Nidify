import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyInputDirective } from "../../../shared/directives/currency-input.directive";
import { CurrencyFormatPipe } from "../../../shared/pipes/currency-format.pipe";

@Component({
  selector: "app-budget",
  standalone: true,
  imports: [CommonModule, CurrencyInputDirective, CurrencyFormatPipe],
  templateUrl: "./budget.component.html",
  styleUrl: "./budget.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent {
  showEditBudget = signal(false);
}
