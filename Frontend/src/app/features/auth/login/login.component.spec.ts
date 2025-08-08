import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { Subject } from "rxjs";

import { ProblemHandlerService } from "../../../core/services/problem-handler.service";
import { ProblemDetails } from "../../../shared/models/problem-details.model";
import { LoginComponent } from "./login.component";

class ProblemHandlerStub {
  private readonly subject = new Subject<ProblemDetails>();
  readonly problems$ = this.subject.asObservable();
  handle(problem: ProblemDetails): void {
    this.subject.next(problem);
  }
}

describe("LoginComponent", () => {
  let handler: ProblemHandlerStub;

  beforeEach(() => {
    handler = new ProblemHandlerStub();
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: ProblemHandlerService, useValue: handler },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
  });

  it("should display error from handler", () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    handler.handle({ status: 400, detail: "Invalid credentials" });
    fixture.detectChanges();
    const alert: HTMLElement | null =
      fixture.nativeElement.querySelector(".alert-error");
    expect(alert?.textContent).toContain("Invalid credentials");
  });
});
