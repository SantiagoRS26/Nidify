import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { HouseholdSwitcherComponent } from "./household-switcher.component";

import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HouseholdSwitcherComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
