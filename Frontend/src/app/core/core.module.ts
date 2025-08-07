import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { apiUrlInterceptor } from './http/api-url.interceptor';
import { authInterceptor } from './auth/auth.interceptor';
import { problemHttpInterceptor } from './interceptors/problem-http.interceptor';

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([apiUrlInterceptor, authInterceptor, problemHttpInterceptor])
    ),
  ],
})
export class CoreModule {}
