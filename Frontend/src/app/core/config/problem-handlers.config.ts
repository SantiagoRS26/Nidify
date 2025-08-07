import { Router } from '@angular/router';
import { ProblemDetails } from '../../shared/models/problem-details.model';

export type ProblemHandler = (problem: ProblemDetails, router: Router) => void;

export const problemHandlers: Record<number, ProblemHandler> = {
  401: redirectToLogin,
  403: redirectToLogin,
  404: notFound,
  409: conflict,
  429: tooManyRequests,
};

export const defaultProblemHandler: ProblemHandler = (problem: ProblemDetails) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled problem', problem);
};

function redirectToLogin(_: ProblemDetails, router: Router): void {
  router.navigate(['/login']);
}

function notFound(_: ProblemDetails, router: Router): void {
  router.navigate(['/not-found']);
}

function conflict(problem: ProblemDetails): void {
  // eslint-disable-next-line no-console
  console.warn('Conflict', problem);
}

function tooManyRequests(problem: ProblemDetails): void {
  // eslint-disable-next-line no-console
  console.warn('Too many requests', problem);
}
