import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { InvitationsComponent } from "./invitations.component";
import { ReactiveFormsModule } from "@angular/forms";

describe("InvitationsComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InvitationsComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(InvitationsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
