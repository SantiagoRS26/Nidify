import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, ReplaySubject, switchMap, throwError, catchError, take } from 'rxjs';

import { AuthService } from '../auth/auth.service';

let refreshInProgress = false;
let refreshSubject: ReplaySubject<string> | null = null;

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
      if (
        error.status === 401 &&
        token &&
        !req.url.includes('/auth/refresh')
      ) {
        return handle401(req, next, auth);
      }
      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
): Observable<HttpEvent<unknown>> {
  if (!refreshInProgress) {
    refreshInProgress = true;
    refreshSubject = new ReplaySubject<string>(1);

    return auth.refreshTokens().pipe(
      switchMap(({ accessToken }) => {
        refreshInProgress = false;
        refreshSubject!.next(accessToken);
        refreshSubject!.complete();
        refreshSubject = null;
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
        return next(cloned);
      }),
      catchError((err) => {
        refreshInProgress = false;
        refreshSubject?.error(err);
        refreshSubject = null;
        auth.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshSubject!.pipe(
      take(1),
      switchMap((token) => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(cloned);
      })
    );
  }
}
