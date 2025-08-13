import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";

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

export interface HouseholdMembership {
  id: string;
  userId: string;
  householdId: string;
  role: "admin" | "member";
  status: "pending" | "active" | "revoked";
  joinedAt: string;
  invitedBy?: string;
  fullName?: string;
}

@Injectable({ providedIn: "root" })
export class HouseholdService {
  private readonly http = inject(HttpClient);
  private readonly householdIdSubject = new BehaviorSubject<string | null>(
    localStorage.getItem("householdId")
  );
  readonly householdId$ = this.householdIdSubject.asObservable();

  hasHousehold(): boolean {
    return !!this.householdIdSubject.value;
  }

  getHouseholdId(): string | null {
    return this.householdIdSubject.value;
  }

  getUserMemberships(): Observable<HouseholdMembership[]> {
    return this.http
      .get<{ memberships: HouseholdMembership[] }>("/auth/me/memberships")
      .pipe(map(({ memberships }) => memberships));
  }

  getMembers(): Observable<HouseholdMembership[]> {
    const householdId = this.getHouseholdId();
    return this.http
      .get<{ members: HouseholdMembership[] }>(
        `/households/${householdId}/members`
      )
      .pipe(map(({ members }) => members));
  }

  getUserHouseholds(): Observable<Household[]> {
    return this.getUserMemberships().pipe(
      switchMap((memberships) => {
        if (!memberships.length) {
          return of([]);
        }
        return forkJoin(
          memberships.map((m) =>
            this.http
              .get<{ household: Household }>(`/households/${m.householdId}`)
              .pipe(map(({ household }) => household))
          )
        );
      })
    );
  }

  initializeHouseholdState(): Observable<boolean> {
    return this.getUserMemberships().pipe(
      tap((memberships) => {
        const activeMembership = memberships.find((m) => m.status === "active");
        if (activeMembership) {
          this.setHousehold(activeMembership.householdId);
        } else {
          this.clear();
        }
      }),
      map((memberships) => memberships.some((m) => m.status === "active"))
    );
  }

  createHousehold(name: string, baseCurrency: string): Observable<Household> {
    return this.http
      .post<{ household: Household }>("/households", { name, baseCurrency })
      .pipe(
        tap(({ household }) => this.setHousehold(household.id)),
        map(({ household }) => household)
      );
  }

  invite(email: string): Observable<Invitation> {
    const householdId = this.getHouseholdId();
    return this.http
      .post<{ invitation: Invitation }>(
        `/households/${householdId}/invitations`,
        {
          email,
        }
      )
      .pipe(map(({ invitation }) => invitation));
  }

  cancelInvitation(invitationId: string): Observable<void> {
    const householdId = this.getHouseholdId();
    return this.http.delete<void>(
      `/households/${householdId}/invitations/${invitationId}`
    );
  }

  acceptInvitation(token: string): Observable<string> {
    return this.http
      .post<{ membership: { householdId: string } }>("/invitations/accept", {
        token,
      })
      .pipe(
        tap(({ membership }) => this.setHousehold(membership.householdId)),
        map(({ membership }) => membership.householdId)
      );
  }

  selectHousehold(id: string): void {
    this.setHousehold(id);
  }

  clear(): void {
    localStorage.removeItem("householdId");
    this.householdIdSubject.next(null);
  }

  private setHousehold(id: string): void {
    localStorage.setItem("householdId", id);
    this.householdIdSubject.next(id);
  }
}
