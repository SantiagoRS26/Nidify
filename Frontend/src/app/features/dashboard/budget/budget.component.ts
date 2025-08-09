import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-budget",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./budget.component.html",
  styleUrl: "./budget.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent {
  showEditBudget = signal(false);
}
