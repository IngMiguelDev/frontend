import { Opportunity } from '../../../core/models/opportunity.model';

export const OPPORTUNITY_MOCKS: Opportunity[] = [
  {
    id: 'opp-1001',
    name: 'Licenciamiento Grupo Andino',
    amount: 120000,
    status: 'novedad',
    createdAt: '2026-03-08T09:10:00.000Z',
    updatedAt: '2026-03-21T14:20:00.000Z',
    expectedCloseDate: '2026-04-20',
    description: 'Oportunidad para centralizar seguimiento comercial en 3 países.',
    lastActivityAt: '2026-03-21T14:20:00.000Z',
    activities: [
      {
        id: 'act-1001',
        type: 'created',
        title: 'Oportunidad creada',
        description: 'Ingreso desde formulario de discovery comercial.',
        createdAt: '2026-03-08T09:10:00.000Z'
      },
      {
        id: 'act-1002',
        type: 'updated',
        title: 'Actualización de alcance',
        description: 'Se agregó propuesta regional con licencias extra.',
        createdAt: '2026-03-21T14:20:00.000Z'
      }
    ],
    notes: [
      {
        id: 'note-1001',
        content: 'Cliente interesado en tablero ejecutivo y automatización básica.',
        author: 'Equipo comercial',
        createdAt: '2026-03-20T10:00:00.000Z'
      }
    ]
  },
  {
    id: 'opp-1002',
    name: 'Renovación Clínica Horizonte',
    amount: 85000,
    status: 'proceso',
    createdAt: '2026-03-04T11:45:00.000Z',
    updatedAt: '2026-03-23T18:00:00.000Z',
    expectedCloseDate: '2026-04-02',
    description: 'Renovación de licencias con ampliación para área de admisiones.',
    lastActivityAt: '2026-03-23T18:00:00.000Z',
    activities: [
      {
        id: 'act-2001',
        type: 'created',
        title: 'Oportunidad creada',
        description: 'Migración desde cartera histórica.',
        createdAt: '2026-03-04T11:45:00.000Z'
      },
      {
        id: 'act-2002',
        type: 'status_changed',
        title: 'Estado actualizado',
        description: 'Se movió de novedad a proceso.',
        createdAt: '2026-03-16T13:40:00.000Z'
      },
      {
        id: 'act-2003',
        type: 'updated',
        title: 'Nueva reunión agendada',
        description: 'Demo funcional programada con stakeholders.',
        createdAt: '2026-03-23T18:00:00.000Z'
      }
    ],
    notes: [
      {
        id: 'note-2001',
        content: 'Solicitan comparativo con proveedor actual antes del cierre.',
        author: 'María Gómez',
        createdAt: '2026-03-22T09:20:00.000Z'
      }
    ]
  },
  {
    id: 'opp-1003',
    name: 'Expansión Retail Nova',
    amount: 230000,
    status: 'verificacion',
    createdAt: '2026-02-28T08:00:00.000Z',
    updatedAt: '2026-03-24T08:30:00.000Z',
    expectedCloseDate: '2026-03-30',
    description: 'Implementación multi-sede con foco en analítica comercial.',
    lastActivityAt: '2026-03-24T08:30:00.000Z',
    activities: [
      {
        id: 'act-3001',
        type: 'created',
        title: 'Oportunidad creada',
        description: 'Lead calificado desde partner regional.',
        createdAt: '2026-02-28T08:00:00.000Z'
      },
      {
        id: 'act-3002',
        type: 'status_changed',
        title: 'Validación legal',
        description: 'Cliente envió contrato para última revisión.',
        createdAt: '2026-03-24T08:30:00.000Z'
      }
    ],
    notes: [
      {
        id: 'note-3001',
        content: 'Pendiente visto bueno de compras para cierre este viernes.',
        author: 'Juan Pardo',
        createdAt: '2026-03-24T08:40:00.000Z'
      }
    ]
  },
  {
    id: 'opp-1004',
    name: 'Automatización Seguros Atlas',
    amount: 64000,
    status: 'completado',
    createdAt: '2026-02-16T15:15:00.000Z',
    updatedAt: '2026-03-19T16:10:00.000Z',
    expectedCloseDate: '2026-03-19',
    description: 'Proyecto cerrado para automatización de funnel y reporting.',
    lastActivityAt: '2026-03-19T16:10:00.000Z',
    activities: [
      {
        id: 'act-4001',
        type: 'created',
        title: 'Oportunidad creada',
        description: 'Se levantó oportunidad con alcance inicial.',
        createdAt: '2026-02-16T15:15:00.000Z'
      },
      {
        id: 'act-4002',
        type: 'status_changed',
        title: 'Cierre exitoso',
        description: 'Contrato firmado y oportunidad completada.',
        createdAt: '2026-03-19T16:10:00.000Z'
      }
    ],
    notes: [
      {
        id: 'note-4001',
        content: 'Equipo de implementación ya recibió handoff.',
        author: 'Sales Ops',
        createdAt: '2026-03-19T17:00:00.000Z'
      }
    ]
  }
];
