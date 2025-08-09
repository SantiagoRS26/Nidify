import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../../core/auth/auth.service";

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
    const code = this.route.snapshot.queryParamMap.get("code");
    if (!code) {
      this.router.navigate(["/login"]);
      return;
    }
    this.authService.oauthLogin(code).subscribe({
      next: () => this.router.navigate(["/home"]),
      error: (err) => {
        console.error("OAuth login failed", err);
        this.router.navigate(["/login"]);
      },
    });
  }
}

