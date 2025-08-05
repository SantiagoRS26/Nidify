import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith("http")) {
    req = req.clone({ url: `${environment.apiUrl}${req.url}` });
  }
  return next(req);
};
