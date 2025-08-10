import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HouseholdSwitcherComponent } from './household-switcher.component';

describe('HouseholdSwitcherComponent', () => {
  let component: HouseholdSwitcherComponent;
  let fixture: ComponentFixture<HouseholdSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdSwitcherComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
