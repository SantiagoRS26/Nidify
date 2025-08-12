import { NgModule, APP_INITIALIZER } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { apiUrlInterceptor } from "./http/api-url.interceptor";
import { authHttpInterceptor } from "./interceptors/auth-http.interceptor";
import { problemHttpInterceptor } from "./interceptors/problem-http.interceptor";
import { authInitializerFactory } from "./auth/auth-initializer";

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([
        apiUrlInterceptor,
        problemHttpInterceptor,
        authHttpInterceptor,
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializerFactory,
      multi: true,
    },
  ],
})
export class CoreModule {}
