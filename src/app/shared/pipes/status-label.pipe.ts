import { Pipe, PipeTransform } from '@angular/core';
import { OpportunityStatus } from '../../core/models/opportunity.model';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: OpportunityStatus): string {
    const labels: Record<OpportunityStatus, string> = {
      novedad: 'Novedad',
      proceso: 'En proceso',
      verificacion: 'Verificación',
      completado: 'Completado'
    };

    return labels[value];
  }
}
