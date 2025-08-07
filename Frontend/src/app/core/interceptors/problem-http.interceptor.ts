import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ProblemHandlerService } from '../services/problem-handler.service';
import { ProblemDetails } from '../../shared/models/problem-details.model';

export const problemHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const problemHandler = inject(ProblemHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const contentType = error.headers.get('Content-Type') ?? '';
      let problem: ProblemDetails | null = null;

      if (contentType.includes('application/problem+json')) {
        problem = parseProblemDetails(error);
      }

      if (!problem && typeof error.error === 'object' && error.error !== null) {
        problem = parseProblemDetails(error);
      }

      if (!problem) {
        problem = fallbackProblemDetails(error);
      }

      problemHandler.handle(problem);

      const newError = new HttpErrorResponse({
        ...error,
        url: error.url ?? undefined,
        error: problem,
      });

      return throwError(() => newError);
    })
  );
};

function parseProblemDetails(error: HttpErrorResponse): ProblemDetails {
  const body = (error.error && typeof error.error === 'object') ? error.error : {};
  const {
    type,
    title,
    status,
    detail,
    instance,
    traceId,
    correlationId,
    ...extensions
  } = body as Record<string, unknown>;

  const headerTrace =
    error.headers.get('traceid') ||
    error.headers.get('x-trace-id') ||
    error.headers.get('correlationid') ||
    error.headers.get('x-correlation-id');

  const problem: ProblemDetails = {
    type: typeof type === 'string' ? (type as string) : undefined,
    title: typeof title === 'string' ? (title as string) : undefined,
    status: typeof status === 'number' ? (status as number) : error.status,
    detail: typeof detail === 'string' ? (detail as string) : undefined,
    instance: typeof instance === 'string' ? (instance as string) : error.url ?? undefined,
    traceId: (traceId as string) || (correlationId as string) || headerTrace || undefined,
  };

  return { ...problem, ...extensions };
}

function fallbackProblemDetails(error: HttpErrorResponse): ProblemDetails {
  return {
    title: error.statusText || 'Unknown Error',
    status: error.status || 0,
    detail:
      typeof error.error === 'string'
        ? error.error
        : error.message,
    traceId:
      error.headers.get('traceid') ||
      error.headers.get('x-trace-id') ||
      error.headers.get('correlationid') ||
      error.headers.get('x-correlation-id') ||
      undefined,
    instance: error.url ?? undefined,
  };
}
