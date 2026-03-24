import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string): string {
    const diffInMs = new Date(value).getTime() - Date.now();
    const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
      { amount: 60, unit: 'seconds' },
      { amount: 60, unit: 'minutes' },
      { amount: 24, unit: 'hours' },
      { amount: 7, unit: 'days' },
      { amount: 4.34524, unit: 'weeks' },
      { amount: 12, unit: 'months' },
      { amount: Number.POSITIVE_INFINITY, unit: 'years' }
    ];

    let duration = diffInMs / 1000;

    for (const division of divisions) {
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.unit);
      }

      duration /= division.amount;
    }

    return formatter.format(0, 'seconds');
  }
}
