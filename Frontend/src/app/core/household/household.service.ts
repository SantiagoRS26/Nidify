import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

export interface Household {
  id: string;
  name: string;
  baseCurrency: string;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class HouseholdService {
  private readonly http = inject(HttpClient);
  private readonly householdIdSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('householdId')
  );
  readonly householdId$ = this.householdIdSubject.asObservable();

  hasHousehold(): boolean {
    return !!this.householdIdSubject.value;
  }

  getHouseholdId(): string | null {
    return this.householdIdSubject.value;
  }

  createHousehold(name: string, baseCurrency: string): Observable<Household> {
    return this.http
      .post<{ household: Household }>('/households', { name, baseCurrency })
      .pipe(tap(({ household }) => this.setHousehold(household.id)), map(({ household }) => household));
  }

  invite(email: string): Observable<Invitation> {
    const householdId = this.getHouseholdId();
    return this.http
      .post<{ invitation: Invitation }>(`/households/${householdId}/invitations`, {
        email,
      })
      .pipe(map(({ invitation }) => invitation));
  }

  cancelInvitation(invitationId: string): Observable<void> {
    const householdId = this.getHouseholdId();
    return this.http.delete<void>(
      `/households/${householdId}/invitations/${invitationId}`,
    );
  }

  acceptInvitation(token: string): Observable<string> {
    return this.http
      .post<{ membership: { householdId: string } }>('/invitations/accept', { token })
      .pipe(
        tap(({ membership }) => this.setHousehold(membership.householdId)),
        map(({ membership }) => membership.householdId)
      );
  }

  clear(): void {
    localStorage.removeItem('householdId');
    this.householdIdSubject.next(null);
  }

  private setHousehold(id: string): void {
    localStorage.setItem('householdId', id);
    this.householdIdSubject.next(id);
  }
}

