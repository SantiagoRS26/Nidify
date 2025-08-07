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
  selector: 'app-problem-inline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-inline.component.html',
  styleUrl: './problem-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemInlineComponent {
  private readonly problemHandler = inject(ProblemHandlerService);
  readonly problem$: Observable<ProblemDetails> = this.problemHandler.problems$;
}
