import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  of,
  Observable,
  tap,
} from "rxjs";

import { User } from "./user.model";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private accessToken: string | null = null;
  private refreshing = false;

  private readonly userSubject = new BehaviorSubject<User | null>(
    this.getStoredUser()
  );
  readonly user$ = this.userSubject.asObservable();

  constructor() {
    ["click", "mousemove", "keydown", "scroll"].forEach((e) =>
      document.addEventListener(e, () => this.handleActivity())
    );
  }

  login(email: string, password: string) {
    const body: LoginRequest = { email, password };
    return this.http
      .post<AuthResponse>("/auth/login", body, { withCredentials: true })
      .pipe(tap((res) => this.storeSession(res)));
  }

  register(fullName: string, email: string, password: string) {
    const body: RegisterRequest = { fullName, email, password };
    return this.http
      .post<AuthResponse>("/auth/register", body, { withCredentials: true })
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem("user");
    this.userSubject.next(null);
    void this.http
      .post("/auth/logout", {}, { withCredentials: true })
      .subscribe();
    this.router.navigate(["/login"]);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Determines whether a JWT is expired or will expire within the given threshold.
   */
  isTokenExpired(
    token: string | null = this.getToken(),
    threshold = 60_000
  ): boolean {
    if (!token) {
      return true;
    }
    try {
      const [, payload] = token.split(".");
      const { exp } = JSON.parse(atob(payload));
      const expiresAt = exp * 1000;
      return Date.now() >= expiresAt - threshold;
    } catch {
      return true;
    }
  }

  refreshTokens() {
    return this.http
      .post<{ accessToken: string }>(
        "/auth/refresh",
        {},
        { withCredentials: true }
      )
      .pipe(tap(({ accessToken }) => (this.accessToken = accessToken)));
  }

  ensureSession(): Observable<boolean> {
    if (this.accessToken && !this.isTokenExpired(this.accessToken, 0)) {
      return of(true);
    }
    return this.refreshTokens().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  hasRole(roles: string[] | string): boolean {
    const user = this.userSubject.value;
    const required = Array.isArray(roles) ? roles : [roles];
    return !!user && user.roles.some((r) => required.includes(r));
  }

  private storeSession({ user, accessToken }: AuthResponse): void {
    this.accessToken = accessToken;
    localStorage.setItem("user", JSON.stringify(user));
    this.userSubject.next(user);
  }

  private handleActivity(): void {
    if (
      this.accessToken &&
      this.isTokenExpired(this.accessToken, 120_000) &&
      !this.refreshing
    ) {
      this.refreshing = true;
      this.refreshTokens()
        .pipe(finalize(() => (this.refreshing = false)))
        .subscribe();
    }
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
