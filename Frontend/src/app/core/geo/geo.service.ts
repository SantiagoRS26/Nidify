import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CurrencyService } from '../currency/currency.service';

@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly currencyService = inject(CurrencyService);

  async getCurrency(): Promise<string | null> {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as { currency?: string };
      const currency = data.currency;
      if (!currency) {
        return null;
      }
      const supported = await firstValueFrom(this.currencyService.getSupported());
      return supported.includes(currency) ? currency : null;
    } catch {
      return null;
    }
  }
}

