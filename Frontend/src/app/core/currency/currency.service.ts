import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly http = inject(HttpClient);
  private readonly supported$ = this.http
    .get<{ currencies: string[] }>('/currency/supported')
    .pipe(map((res) => res.currencies), shareReplay(1));

  getSupported(): Observable<string[]> {
    return this.supported$;
  }
}
