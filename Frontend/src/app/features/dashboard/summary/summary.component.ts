import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyFormatPipe } from "../../../shared/pipes/currency-format.pipe";

@Component({
  selector: "app-summary",
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: "./summary.component.html",
  styleUrl: "./summary.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {}
