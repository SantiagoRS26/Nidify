import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HouseholdService } from "./household.service";

@Injectable({ providedIn: "root" })
export class HouseholdGuard implements CanActivate {
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.householdService.initializeHouseholdState().pipe(
      map((hasActiveHousehold) => {
        if (!hasActiveHousehold) {
          this.router.navigate(["/onboarding"]);
        }
        return hasActiveHousehold;
      }),
      catchError(() => {
        this.router.navigate(["/onboarding"]);
        return of(false);
      })
    );
  }
}