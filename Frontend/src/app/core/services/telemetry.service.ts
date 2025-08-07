import { Injectable } from '@angular/core';
import { ProblemDetails } from '../../shared/models/problem-details.model';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  log(problem: ProblemDetails): void {
    const { traceId, status, type, detail, instance } = problem;
    // In real scenario, send to telemetry backend and redact sensitive data
    // Here we just log to console
    // eslint-disable-next-line no-console
    console.log('telemetry', { traceId, status, type, detail, instance });
  }
}
