import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../../core/auth/auth.service";
import { User } from "../../../core/auth/user.model";

@Component({
  selector: "app-google-callback",
  standalone: true,
  imports: [CommonModule],
  template: `<p>Procesando autenticación...</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");
    const userParam = this.route.snapshot.queryParamMap.get("user");
    const error = this.route.snapshot.queryParamMap.get("error");

    if (error || !token || !userParam) {
      this.router.navigate(["/login"]);
      return;
    }

    try {
      const user: User = JSON.parse(decodeURIComponent(userParam));
      this.authService.completeOAuthLogin(user, token);
      this.router.navigate(["/home"]);
    } catch (err) {
      console.error("OAuth login failed", err);
      this.router.navigate(["/login"]);
    }
  }
}

