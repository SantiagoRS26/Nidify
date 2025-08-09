import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

/**
 * Factory para inicializar la autenticación al arrancar la aplicación.
 * Realiza un silent refresh si hay una sesión previa almacenada.
 */
export function authInitializerFactory() {
  const authService = inject(AuthService);

  return (): Promise<boolean> => {
    return authService.initialize();
  };
}
