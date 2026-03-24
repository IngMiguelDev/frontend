import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import {
  Opportunity,
  OpportunityActivity,
  OpportunityNote,
  OpportunityStatus,
  OpportunityUpsertPayload
} from '../../../core/models/opportunity.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { OPPORTUNITY_MOCKS } from '../mocks/opportunities.mock';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesService {
  private readonly storageKey = 'growtek.crm.opportunities';
  private readonly opportunitiesState = signal<Opportunity[]>(
    this.storageService.getItem(this.storageKey, OPPORTUNITY_MOCKS)
  );

  readonly opportunities = computed(() => this.opportunitiesState());

  constructor(private readonly storageService: LocalStorageService) {}

  list(): Observable<Opportunity[]> {
    return of(this.opportunities()).pipe(delay(220));
  }

  getOpportunityById(id: string): Opportunity | undefined {
    return this.opportunities().find((opportunity) => opportunity.id === id);
  }

  create(payload: OpportunityUpsertPayload): Observable<Opportunity> {
    const now = new Date().toISOString();
    const opportunity: Opportunity = {
      id: crypto.randomUUID(),
      name: payload.name,
      amount: payload.amount,
      status: 'novedad',
      createdAt: now,
      updatedAt: now,
      expectedCloseDate: payload.expectedCloseDate,
      description: payload.description,
      lastActivityAt: now,
      activities: [
        this.createActivity(
          'created',
          'Oportunidad creada',
          'Se registró una nueva oportunidad desde el tablero.',
          now
        )
      ],
      notes: []
    };

    return of(opportunity).pipe(
      delay(250),
      tap((createdOpportunity) => {
        this.commit([createdOpportunity, ...this.opportunities()]);
      })
    );
  }

  update(id: string, payload: OpportunityUpsertPayload): Observable<Opportunity | undefined> {
    const opportunity = this.getOpportunityById(id);

    if (!opportunity) {
      return of(undefined);
    }

    const now = new Date().toISOString();
    const updatedOpportunity: Opportunity = {
      ...opportunity,
      ...payload,
      updatedAt: now,
      lastActivityAt: now,
      activities: [
        this.createActivity(
          'updated',
          'Oportunidad actualizada',
          'Se modificó la información principal de la oportunidad.',
          now
        ),
        ...opportunity.activities
      ]
    };

    return of(updatedOpportunity).pipe(
      delay(250),
      tap((result) => {
        this.commit(
          this.opportunities().map((currentOpportunity) =>
            currentOpportunity.id === id ? result : currentOpportunity
          )
        );
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(200),
      tap(() => {
        this.commit(this.opportunities().filter((opportunity) => opportunity.id !== id));
      })
    );
  }

  updateStatus(id: string, status: OpportunityStatus): Observable<Opportunity | undefined> {
    const opportunity = this.getOpportunityById(id);

    if (!opportunity || opportunity.status === status) {
      return of(opportunity);
    }

    const now = new Date().toISOString();
    const updatedOpportunity: Opportunity = {
      ...opportunity,
      status,
      updatedAt: now,
      lastActivityAt: now,
      activities: [
        this.createActivity(
          'status_changed',
          'Estado actualizado',
          `La oportunidad cambió al estado ${status}.`,
          now
        ),
        ...opportunity.activities
      ]
    };

    return of(updatedOpportunity).pipe(
      delay(180),
      tap((result) => {
        this.commit(
          this.opportunities().map((currentOpportunity) =>
            currentOpportunity.id === id ? result : currentOpportunity
          )
        );
      })
    );
  }

  addNote(id: string, content: string, author = 'Equipo comercial'): Observable<OpportunityNote | undefined> {
    const opportunity = this.getOpportunityById(id);

    if (!opportunity) {
      return of(undefined);
    }

    const now = new Date().toISOString();
    const note: OpportunityNote = {
      id: crypto.randomUUID(),
      content,
      author,
      createdAt: now
    };

    const updatedOpportunity: Opportunity = {
      ...opportunity,
      updatedAt: now,
      lastActivityAt: now,
      notes: [note, ...opportunity.notes],
      activities: [
        this.createActivity(
          'note_added',
          'Nueva nota agregada',
          content,
          now
        ),
        ...opportunity.activities
      ]
    };

    return of(note).pipe(
      delay(180),
      tap(() => {
        this.commit(
          this.opportunities().map((currentOpportunity) =>
            currentOpportunity.id === id ? updatedOpportunity : currentOpportunity
          )
        );
      })
    );
  }

  private commit(opportunities: Opportunity[]): void {
    this.opportunitiesState.set(opportunities);
    this.storageService.setItem(this.storageKey, opportunities);
  }

  private createActivity(
    type: OpportunityActivity['type'],
    title: string,
    description: string,
    createdAt: string
  ): OpportunityActivity {
    return {
      id: crypto.randomUUID(),
      type,
      title,
      description,
      createdAt
    };
  }
}
