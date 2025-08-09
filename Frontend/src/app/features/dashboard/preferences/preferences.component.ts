import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-preferences",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./preferences.component.html",
  styleUrl: "./preferences.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent {}
