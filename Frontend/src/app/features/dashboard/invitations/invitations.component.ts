import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-invitations",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./invitations.component.html",
  styleUrl: "./invitations.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationsComponent {}
