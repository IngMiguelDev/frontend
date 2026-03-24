import { OpportunityStatus } from '../../core/models/opportunity.model';

export const OPPORTUNITY_STATUS_ORDER: OpportunityStatus[] = [
  'novedad',
  'proceso',
  'verificacion',
  'completado'
];

export const OPPORTUNITY_STATUS_META: Record<
  OpportunityStatus,
  { label: string; accent: string; progress: number }
> = {
  novedad: { label: 'Novedad', accent: '#6d8cff', progress: 25 },
  proceso: { label: 'En proceso', accent: '#ffb84d', progress: 50 },
  verificacion: { label: 'Verificación', accent: '#3ecf8e', progress: 75 },
  completado: { label: 'Completado', accent: '#0ea5e9', progress: 100 }
};
