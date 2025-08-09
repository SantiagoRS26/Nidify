import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-items",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./items.component.html",
  styleUrl: "./items.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  // Solo UI: toggles locales para modales
  showNewItemModal = signal(false);
  showSplitModal = signal(false);
}
