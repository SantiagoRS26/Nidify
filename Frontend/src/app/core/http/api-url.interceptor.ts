import { HttpInterceptorFn } from '@angular/common/http';

const apiUrl = (import.meta as any).env['NG_APP_API_URL'] ?? '';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http')) {
    req = req.clone({ url: `${apiUrl}${req.url}` });
  }
  return next(req);
};
