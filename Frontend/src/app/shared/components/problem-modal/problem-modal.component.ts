import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ProblemHandlerService } from '../../../core/services/problem-handler.service';
import { ProblemDetails } from '../../models/problem-details.model';

@Component({
  selector: 'app-problem-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-modal.component.html',
  styleUrl: './problem-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemModalComponent {
  private readonly handler = inject(ProblemHandlerService);
  readonly problem$: Observable<ProblemDetails> = this.handler.problems$;
}
