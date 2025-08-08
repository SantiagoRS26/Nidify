import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it("stores access token in memory and user in storage on login", () => {
    service.login("test@example.com", "123456").subscribe();
    const req = httpMock.expectOne("/auth/login");
    expect(req.request.withCredentials).toBeTrue();
    req.flush({
      user: {
        id: "1",
        fullName: "Test User",
        email: "test@example.com",
        roles: ["admin"],
      },
      accessToken: "token",
    });

    expect(service.getToken()).toBe("token");
    expect(localStorage.getItem("user")).toContain("Test User");
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("does not refresh token on activity when unauthenticated", () => {
    // No hay token cargado, no debe intentar refrescar automáticamente
    httpMock.expectNone("/auth/refresh");
  });

  it("programa un refresh antes de la expiración y refresca el token", fakeAsync(() => {
    // exp dentro de 10 segundos -> con threshold 120s se agenda inmediato (delay 0)
    const exp = Math.floor(Date.now() / 1000) + 10;
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ exp }));
    const token = `${header}.${payload}.sig`;

    (service as any).onAccessTokenUpdated(token);

    // Avanzar timers para ejecutar el setTimeout(0)
    tick(0);

    const refresh = httpMock.expectOne("/auth/refresh");
    expect(refresh.request.withCredentials).toBeTrue();
    refresh.flush({ accessToken: "newAccess" });
  }));
});
