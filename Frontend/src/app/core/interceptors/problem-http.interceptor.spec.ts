import { HttpClient, HttpErrorResponse, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProblemDetails } from '../../shared/models/problem-details.model';
import { ProblemHandlerService } from '../services/problem-handler.service';
import { problemHttpInterceptor } from './problem-http.interceptor';

describe('problemHttpInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let handler: jasmine.SpyObj<ProblemHandlerService>;

  beforeEach(() => {
    handler = jasmine.createSpyObj('ProblemHandlerService', ['handle']);
    TestBed.configureTestingModule({
      providers: [
        { provide: ProblemHandlerService, useValue: handler },
        provideHttpClient(withInterceptors([problemHttpInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should normalize problem details', (done) => {
    http.get('/test').subscribe({
      next: () => fail('expected error'),
      error: (err: HttpErrorResponse) => {
        const problem = err.error as ProblemDetails;
        expect(problem.status).toBe(400);
        expect(problem.detail).toBe('Invalid');
        expect(problem.traceId).toBe('trace-123');
        expect(handler.handle).toHaveBeenCalled();
        done();
      },
    });

    const req = controller.expectOne('/test');
    req.flush(
      {
        type: 'https://example.com/error',
        title: 'Bad Request',
        status: 400,
        detail: 'Invalid',
      },
      {
        status: 400,
        statusText: 'Bad Request',
        headers: new HttpHeaders({
          'Content-Type': 'application/problem+json',
          'X-Trace-Id': 'trace-123',
        }),
      }
    );
  });
});
