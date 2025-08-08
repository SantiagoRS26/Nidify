import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authHttpInterceptor } from './auth-http.interceptor';
import { AuthService } from '../auth/auth.service';

function createToken(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

describe('authHttpInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        provideHttpClient(withInterceptors([authHttpInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('refreshes the token once and retries queued requests', (done) => {
    const expired = Math.floor(Date.now() / 1000) - 10;
    (auth as any).accessToken = createToken(expired);

    const responses: string[] = [];
    http.get<string>('/data').subscribe((r) => responses.push(r));
    http.get<string>('/data2').subscribe((r) => {
      responses.push(r);
      expect(responses).toEqual(['ok1', 'ok2']);
      done();
    });

    const req1 = controller.expectOne('/data');
    req1.flush(null, { status: 401, statusText: 'Unauthorized' });
    const req2 = controller.expectOne('/data2');
    req2.flush(null, { status: 401, statusText: 'Unauthorized' });

    const refresh = controller.expectOne('/auth/refresh');
    expect(refresh.request.body).toEqual({});
    expect(refresh.request.withCredentials).toBeTrue();
    refresh.flush({ accessToken: 'newAccess' });

    const retry1 = controller.expectOne('/data');
    expect(retry1.request.headers.get('Authorization')).toBe('Bearer newAccess');
    retry1.flush('ok1');

    const retry2 = controller.expectOne('/data2');
    expect(retry2.request.headers.get('Authorization')).toBe('Bearer newAccess');
    retry2.flush('ok2');
  });
});
