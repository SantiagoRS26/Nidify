import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ProblemHandlerService } from './problem-handler.service';
import { TelemetryService } from './telemetry.service';
import { ProblemDetails } from '../../shared/models/problem-details.model';

describe('ProblemHandlerService', () => {
  let service: ProblemHandlerService;
  let router: jasmine.SpyObj<Router>;
  let telemetry: jasmine.SpyObj<TelemetryService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    telemetry = jasmine.createSpyObj('TelemetryService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        ProblemHandlerService,
        { provide: Router, useValue: router },
        { provide: TelemetryService, useValue: telemetry },
      ],
    });
    service = TestBed.inject(ProblemHandlerService);
  });

  it('should emit problems', (done) => {
    service.problems$.subscribe((p: ProblemDetails) => {
      expect(p.status).toBe(500);
      done();
    });
    service.handle({ status: 500, title: 'error' });
  });

  it('should redirect to login on 401', () => {
    service.handle({ status: 401 });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
