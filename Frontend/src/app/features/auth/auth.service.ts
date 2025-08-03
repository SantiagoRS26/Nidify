import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(email: string, password: string) {
    const body: LoginRequest = { email, password };
    return this.http.post('/auth/login', body);
  }

  register(name: string, email: string, password: string) {
    const body: RegisterRequest = { name, email, password };
    return this.http.post('/auth/register', body);
  }
}
