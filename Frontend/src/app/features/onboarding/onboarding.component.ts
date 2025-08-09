import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { HouseholdService } from "../../core/household/household.service";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./onboarding.component.html",
  styleUrl: "./onboarding.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly createForm = this.fb.nonNullable.group({
    name: ["", [Validators.required]],
    baseCurrency: ["USD", [Validators.required]],
    initialBudget: [0],
    monthlyBudget: [0],
  });

  readonly inviteForm = this.fb.nonNullable.group({
    token: ["", [Validators.required]],
  });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (token) {
      this.householdService.acceptInvitation(token).subscribe(() => {
        this.router.navigate(["/home"]);
      });
    }
  }

  onCreate(): void {
    if (this.createForm.invalid) {
      return;
    }
    const { name, baseCurrency } = this.createForm.getRawValue();
    this.householdService.createHousehold(name, baseCurrency).subscribe(() => {
      this.router.navigate(["/home"]);
    });
  }

  onAccept(): void {
    if (this.inviteForm.invalid) {
      return;
    }
    const { token } = this.inviteForm.getRawValue();
    this.householdService.acceptInvitation(token).subscribe(() => {
      this.router.navigate(["/home"]);
    });
  }
}
