import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HouseholdService } from "../../core/household/household.service";

@Component({
  selector: "app-household-switcher",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./household-switcher.component.html",
  styleUrl: "./household-switcher.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdSwitcherComponent {
  private readonly householdService = inject(HouseholdService);
  readonly households$ = this.householdService.getUserHouseholds();
  readonly householdId$ = this.householdService.householdId$;

  onSelect(id: string): void {
    this.householdService.selectHousehold(id);
  }
}
