import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-changelog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./changelog.component.html",
  styleUrl: "./changelog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent {}
