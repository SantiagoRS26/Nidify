import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AuthService } from "../../../core/auth/auth.service";
import { GoogleAuthService } from "../../../core/auth/google-auth.service";
import { GeoService } from "../../../core/geo/geo.service";
import { take } from "rxjs";

@Component({
  selector: "app-preferences",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./preferences.component.html",
  styleUrl: "./preferences.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {
  private readonly authService = inject(AuthService);
  private readonly googleAuth = inject(GoogleAuthService);
  private readonly geo = inject(GeoService);

  currencies = ["USD", "EUR", "ARS", "MXN"];
  selectedCurrency = this.currencies[0];

  constructor() {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user?.preferredCurrency) {
        this.selectedCurrency = user.preferredCurrency;
      } else {
        this.geo.getCurrency().then((curr) => {
          if (curr) {
            this.selectedCurrency = curr;
          }
        });
      }
    });
  }

  linkGoogle(): void {
    this.googleAuth.signIn().then((idToken) => {
      this.authService.linkGoogleAccount(idToken).subscribe();
    });
  }

  save(): void {
    this.authService
      .updatePreferredCurrency(this.selectedCurrency)
      .subscribe();
  }
}
