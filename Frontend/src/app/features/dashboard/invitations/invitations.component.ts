import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

import {
  HouseholdService,
  Invitation,
} from "../../../core/household/household.service";

@Component({
  selector: "app-invitations",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./invitations.component.html",
  styleUrl: "./invitations.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly householdService = inject(HouseholdService);

  readonly inviteForm = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
  });

  readonly invitations = signal<Invitation[]>([]);

  onInvite(): void {
    if (this.inviteForm.invalid) {
      return;
    }
    const { email } = this.inviteForm.getRawValue();
    this.householdService.invite(email).subscribe((invitation) => {
      this.inviteForm.reset();
      this.invitations.update((list) => [...list, invitation]);
    });
  }

  copyLink(invitation: Invitation): void {
    const url = `${location.origin}/onboarding?token=${invitation.token}`;
    navigator.clipboard.writeText(url);
  }

  cancel(invitation: Invitation): void {
    this.householdService.cancelInvitation(invitation.id).subscribe(() => {
      this.invitations.update((list) =>
        list.filter((i) => i.id !== invitation.id),
      );
    });
  }

  getExpiration(invitation: Invitation): string {
    if (!invitation.expiresAt) {
      return "";
    }
    const diff = Math.ceil(
      (new Date(invitation.expiresAt).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );
    return `expira en ${diff} días`;
  }
}
