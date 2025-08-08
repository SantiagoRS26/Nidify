import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { apiUrlInterceptor } from './http/api-url.interceptor';
import { authHttpInterceptor } from './interceptors/auth-http.interceptor';
import { problemHttpInterceptor } from './interceptors/problem-http.interceptor';

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([apiUrlInterceptor, authHttpInterceptor, problemHttpInterceptor])
    ),
  ],
})
export class CoreModule {}
