import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./onboarding.component.html",
  styleUrl: "./onboarding.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent {}
