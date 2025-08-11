import { Directive, ElementRef, HostListener, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyFormatService } from '../services/currency-format.service';

@Directive({
  selector: '[currencyInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true,
    },
  ],
})
export class CurrencyInputDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly currencyFormat = inject(CurrencyFormatService);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    const formatted =
      value !== null && value !== undefined
        ? this.currencyFormat.format(value)
        : '';
    this.elementRef.nativeElement.value = formatted;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event'])
  handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    const numeric = value ? this.currencyFormat.parse(value) : 0;
    this.onChange(numeric);
    const formatted = value ? this.currencyFormat.format(numeric) : '';
    this.elementRef.nativeElement.value = formatted;
  }

  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
  }
}
