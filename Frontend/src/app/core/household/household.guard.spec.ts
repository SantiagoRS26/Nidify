import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { HouseholdGuard } from './household.guard';
import { HouseholdService } from './household.service';

describe('HouseholdGuard', () => {
  let guard: HouseholdGuard;
  let router: Router;
  let service: jasmine.SpyObj<HouseholdService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('HouseholdService', ['hasHousehold']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: HouseholdService, useValue: service }],
    });
    guard = TestBed.inject(HouseholdGuard);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('allows navigation when household exists', () => {
    service.hasHousehold.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects to onboarding when no household', () => {
    service.hasHousehold.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/onboarding']);
  });
});
