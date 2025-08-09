import { Routes } from "@angular/router";
import { AuthGuard } from "./core/auth/auth.guard";
import { HouseholdGuard } from "./core/household/household.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./features/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "onboarding",
    loadComponent: () =>
      import("./features/onboarding/onboarding.component").then(
        (m) => m.OnboardingComponent
      ),
  },
  {
    path: "home",
    canActivate: [AuthGuard, HouseholdGuard],
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./features/dashboard/summary/summary.component").then(
            (m) => m.SummaryComponent
          ),
      },
      {
        path: "items",
        loadComponent: () =>
          import("./features/dashboard/items/items.component").then(
            (m) => m.ItemsComponent
          ),
      },
      {
        path: "presupuesto",
        loadComponent: () =>
          import("./features/dashboard/budget/budget.component").then(
            (m) => m.BudgetComponent
          ),
      },
      {
        path: "historial",
        loadComponent: () =>
          import("./features/dashboard/changelog/changelog.component").then(
            (m) => m.ChangelogComponent
          ),
      },
      {
        path: "invitaciones",
        loadComponent: () =>
          import("./features/dashboard/invitations/invitations.component").then(
            (m) => m.InvitationsComponent
          ),
      },
      {
        path: "preferencias",
        loadComponent: () =>
          import("./features/dashboard/preferences/preferences.component").then(
            (m) => m.PreferencesComponent
          ),
      },
    ],
  },
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "**", redirectTo: "home" },
];
