import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { HouseholdGuard } from './household.guard';
import { HouseholdService } from './household.service';

describe('HouseholdGuard', () => {
  let guard: HouseholdGuard;
  let router: Router;
  let service: jasmine.SpyObj<HouseholdService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('HouseholdService', [
      'initializeHouseholdState',
    ]);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: HouseholdService, useValue: service }],
    });
    guard = TestBed.inject(HouseholdGuard);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('allows navigation when household exists', fakeAsync(() => {
    service.initializeHouseholdState.and.returnValue(of(true));
    let result: boolean | undefined;
    guard.canActivate().subscribe((res) => (result = res));
    tick();
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('redirects to onboarding when no household', fakeAsync(() => {
    service.initializeHouseholdState.and.returnValue(of(false));
    let result: boolean | undefined;
    guard.canActivate().subscribe((res) => (result = res));
    tick();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);
  }));

  it('redirects to onboarding on error', fakeAsync(() => {
    service.initializeHouseholdState.and.returnValue(
      throwError(() => new Error('error'))
    );
    let result: boolean | undefined;
    guard.canActivate().subscribe((res) => (result = res));
    tick();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);
  }));
});