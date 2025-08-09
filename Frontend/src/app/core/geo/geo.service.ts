import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeoService {
  async getCurrency(): Promise<string | null> {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as { currency?: string };
      return data.currency ?? null;
    } catch {
      return null;
    }
  }
}
