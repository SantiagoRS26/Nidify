import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

import { User } from './user.model';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSubject = new BehaviorSubject<User | null>(
    this.getStoredUser(),
  );
  readonly user$ = this.userSubject.asObservable();

  login(email: string, password: string) {
    const body: LoginRequest = { email, password };
    return this.http.post<AuthResponse>('/auth/login', body).pipe(
      tap((res) => this.storeSession(res)),
    );
  }

  register(name: string, email: string, password: string) {
    const body: RegisterRequest = { name, email, password };
    return this.http.post<AuthResponse>('/auth/register', body).pipe(
      tap((res) => this.storeSession(res)),
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Determines whether a JWT is expired or will expire within the next minute.
   */
  isTokenExpired(token: string | null = this.getToken()): boolean {
    if (!token) {
      return true;
    }
    try {
      const [, payload] = token.split('.');
      const { exp } = JSON.parse(atob(payload));
      const expiresAt = exp * 1000;
      const threshold = 60_000; // 1 minute
      return Date.now() >= expiresAt - threshold;
    } catch {
      return true;
    }
  }

  refreshTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        '/auth/refresh',
        { refreshToken },
      )
      .pipe(
        tap(({ accessToken, refreshToken: newRefresh }) => {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefresh);
        }),
      );
  }

  hasRole(roles: string[] | string): boolean {
    const user = this.userSubject.value;
    const required = Array.isArray(roles) ? roles : [roles];
    return !!user && user.roles.some((r) => required.includes(r));
  }

  private storeSession({ user, accessToken, refreshToken }: AuthResponse): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  }
}

