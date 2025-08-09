import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  /**
   * Initiates the Google identity flow and resolves with the ID token.
   */
  signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      const google = window.google?.accounts?.id;
      if (!google) {
        reject('Google SDK not loaded');
        return;
      }
      google.initialize({
        client_id: environment.googleClientId,
        callback: (res: any) => resolve(res.credential),
      });
      google.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject('User cancelled');
        }
      });
    });
  }
}

