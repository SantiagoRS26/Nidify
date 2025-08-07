import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ProblemDetails } from '../../shared/models/problem-details.model';
import { TelemetryService } from './telemetry.service';
import {
  defaultProblemHandler,
  problemHandlers,
} from '../config/problem-handlers.config';

@Injectable({ providedIn: 'root' })
export class ProblemHandlerService {
  private readonly problemSubject = new Subject<ProblemDetails>();
  readonly problems$ = this.problemSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly telemetry: TelemetryService
  ) {}

  handle(problem: ProblemDetails): void {
    this.telemetry.log(problem);
    const handler = problemHandlers[problem.status ?? 0] ?? defaultProblemHandler;
    handler(problem, this.router);
    this.problemSubject.next(problem);
  }
}
