import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HouseholdService } from './household.service';

@Injectable({ providedIn: 'root' })
export class HouseholdGuard implements CanActivate {
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const ok = this.householdService.hasHousehold();
    if (!ok) {
      this.router.navigate(['/onboarding']);
    }
    return ok;
  }
}
