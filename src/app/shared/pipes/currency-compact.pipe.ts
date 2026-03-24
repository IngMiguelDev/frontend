import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCompact',
  standalone: true
})
export class CurrencyCompactPipe implements PipeTransform {
  transform(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }
}
