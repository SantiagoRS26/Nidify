import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthService } from "../../../core/auth/auth.service";
import { GoogleAuthService } from "../../../core/auth/google-auth.service";

@Component({
  selector: "app-preferences",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./preferences.component.html",
  styleUrl: "./preferences.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {
  private readonly authService = inject(AuthService);
  private readonly googleAuth = inject(GoogleAuthService);

  linkGoogle(): void {
    this.googleAuth.signIn().then((idToken) => {
      this.authService.linkGoogleAccount(idToken).subscribe();
    });
  }
}
