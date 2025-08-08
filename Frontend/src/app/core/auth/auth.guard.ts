import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.ensureSession().pipe(
      map((ok) => {
        if (!ok) {
          this.router.navigate(['/login']);
        }
        return ok;
      }),
    );
  }
}
