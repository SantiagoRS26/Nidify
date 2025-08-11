import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrencyFormatService {
  private readonly formatter = new Intl.NumberFormat('es-ES', {
    useGrouping: true,
  });

  format(value: number): string {
    return this.formatter.format(value);
  }

  parse(value: string): number {
    const groupSymbol = this.formatter
      .formatToParts(1000)
      .find((part) => part.type === 'group')?.value ?? '.';
    const decimalSymbol = this.formatter
      .formatToParts(1.1)
      .find((part) => part.type === 'decimal')?.value ?? ',';
    const normalized = value
      .replace(new RegExp(`\\${groupSymbol}`, 'g'), '')
      .replace(decimalSymbol, '.');
    return Number(normalized);
  }
}
