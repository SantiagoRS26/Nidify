import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

import { AuthService } from "../../../core/auth/auth.service";
import { ProblemInlineComponent } from "../../../shared/components/problem-inline/problem-inline.component";
import { GeoService } from "../../../core/geo/geo.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ProblemInlineComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly geo = inject(GeoService);

  readonly form = this.fb.nonNullable.group({
    fullName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, password } = this.form.getRawValue();
    this.geo.getCurrency().then((currency) => {
      this.authService
        .register(fullName, email, password, currency ?? undefined)
        .subscribe({
          next: () => {
            this.router.navigate(["/home"]);
          },
        });
    });
  }
}
