import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores tokens on login', () => {
    service.login('test@example.com', '123456').subscribe();
    const req = httpMock.expectOne('/auth/login');
    req.flush({
      user: {
        id: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        roles: ['admin'],
      },
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    expect(localStorage.getItem('accessToken')).toBe('token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh');
  });
});
