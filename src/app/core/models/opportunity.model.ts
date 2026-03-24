export type OpportunityStatus = 'novedad' | 'proceso' | 'verificacion' | 'completado';

export type OpportunityActivityType =
  | 'created'
  | 'status_changed'
  | 'updated'
  | 'note_added';

export interface OpportunityActivity {
  id: string;
  type: OpportunityActivityType;
  title: string;
  description: string;
  createdAt: string;
}

export interface OpportunityNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  amount: number;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  expectedCloseDate: string;
  description: string;
  lastActivityAt: string;
  activities: OpportunityActivity[];
  notes: OpportunityNote[];
}

export interface OpportunityUpsertPayload {
  name: string;
  amount: number;
  expectedCloseDate: string;
  description: string;
}

export interface OpportunityFilters {
  search: string;
  status: OpportunityStatus | 'todos';
  sortBy: 'updatedAt' | 'amount' | 'name';
}
