import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyFormatService } from '../services/currency-format.service';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  private readonly currencyFormat = inject(CurrencyFormatService);

  transform(value: number | null | undefined): string {
    if (value == null) {
      return '';
    }
    return this.currencyFormat.format(value);
  }
}
