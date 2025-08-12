import { Injectable } from "@angular/core";
import { ProblemDetails } from "../../shared/models/problem-details.model";

@Injectable({ providedIn: "root" })
export class TelemetryService {
  log(problem: ProblemDetails): void {
    const { traceId, status, type, detail, instance } = problem;

    console.log("telemetry", { traceId, status, type, detail, instance });
  }
}
