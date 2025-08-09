import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

declare global {
  interface Window {
    google?: any;
  }
}

@Injectable({ providedIn: "root" })
export class GoogleAuthService {
  private isInitialized = false;

  signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      const google = window.google?.accounts?.id;
      if (!google) {
        reject("Google SDK no está cargado. Recarga la página.");
        return;
      }

      if (!this.isInitialized) {
        try {
          google.initialize({
            client_id: environment.googleClientId,
            callback: (res: any) => {
              if (res.credential) {
                resolve(res.credential);
              } else {
                reject("No se recibió credencial de Google");
              }
            },
            auto_select: false, // Evita problemas con FedCM
            cancel_on_tap_outside: false,
          });
          this.isInitialized = true;
        } catch (error) {
          reject(`Error al inicializar Google Auth: ${error}`);
          return;
        }
      }

      try {
        google.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            reject(
              "Google One Tap no se pudo mostrar. Verifica la configuración del dominio."
            );
          } else if (notification.isSkippedMoment()) {
            reject("El usuario cerró el popup de Google");
          } else if (notification.isDismissedMoment()) {
            reject("El usuario canceló el login");
          }
        });
      } catch (error) {
        reject(`Error al mostrar popup de Google: ${error}`);
      }
    });
  }

  /**
   * Alternativa: Renderizar botón de Google (más estable)
   */
  renderButton(elementId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const google = window.google?.accounts?.id;
      if (!google) {
        reject("Google SDK no está cargado");
        return;
      }

      const element = document.getElementById(elementId);
      if (!element) {
        reject(`Elemento con ID '${elementId}' no encontrado`);
        return;
      }

      google.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject("No se recibió credencial de Google");
          }
        },
      });

      google.renderButton(element, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: "signin_with",
        locale: "es",
      });
    });
  }
}
