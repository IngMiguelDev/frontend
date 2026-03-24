import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs';
import {
  Opportunity,
  OpportunityFilters,
  OpportunityStatus,
  OpportunityUpsertPayload
} from '../../../core/models/opportunity.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import {
  OPPORTUNITY_STATUS_META,
  OPPORTUNITY_STATUS_ORDER
} from '../../../shared/utils/opportunity.util';
import { OpportunitiesService } from '../services/opportunities.service';
import { OpportunityFormDrawerComponent } from '../components/opportunity-form-drawer.component';
import { OpportunityKanbanColumnComponent } from '../components/opportunity-kanban-column.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-opportunities-board-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OpportunityKanbanColumnComponent,
    OpportunityFormDrawerComponent,
    EmptyStateComponent
  ],
  template: `
    <section class="board-page">
      <div class="hero">
        <div>
          <p class="eyebrow">Pipeline overview</p>
          <h1>Tablero Kanban de oportunidades</h1>
          <p class="hero__description">
            Gestiona el funnel completo, mueve oportunidades entre etapas y entra al detalle
            operativo sin salir del CRM.
          </p>
        </div>

        <button type="button" class="primary" (click)="startCreate()">Nueva oportunidad</button>
      </div>

      <section class="stats">
        @for (status of statusOrder; track status) {
          <article class="stat-card">
            <span [style.background]="statusMeta[status].accent"></span>
            <div>
              <strong>{{ statusMeta[status].label }}</strong>
              <p>{{ getCountByStatus(status) }} oportunidades</p>
            </div>
          </article>
        }
      </section>

      <section class="toolbar">
        <label>
          <span>Buscar</span>
          <input
            type="search"
            [ngModel]="filters().search"
            (ngModelChange)="updateFilters({ search: $event })"
            placeholder="Buscar por nombre o descripción" />
        </label>

        <label>
          <span>Estado</span>
          <select
            [ngModel]="filters().status"
            (ngModelChange)="updateFilters({ status: $event })">
            <option value="todos">Todos</option>
            @for (status of statusOrder; track status) {
              <option [value]="status">{{ statusMeta[status].label }}</option>
            }
          </select>
        </label>

        <label>
          <span>Ordenar por</span>
          <select
            [ngModel]="filters().sortBy"
            (ngModelChange)="updateFilters({ sortBy: $event })">
            <option value="updatedAt">Última actividad</option>
            <option value="amount">Valor</option>
            <option value="name">Nombre</option>
          </select>
        </label>
      </section>

      @if (loading()) {
        <section class="loading-state">Cargando pipeline...</section>
      } @else if (filteredOpportunities().length) {
        <section class="board-grid">
          @for (status of statusOrder; track status) {
            <app-opportunity-kanban-column
              [title]="statusMeta[status].label"
              [subtitle]="status === 'completado' ? 'Closed won' : 'Open pipeline'"
              [status]="status"
              [opportunities]="columns()[status]"
              [connectedTo]="dropListIds"
              [dropListId]="'kanban-' + status"
              (dropped)="handleDrop($event.event, $event.status)"
              (opened)="openDetail($event)"
              (edited)="startEdit($event)"
              (deleted)="removeOpportunity($event)" />
          }
        </section>
      } @else {
        <app-empty-state
          eyebrow="Sin coincidencias"
          title="No encontramos oportunidades con estos filtros"
          description="Prueba otra búsqueda o crea una nueva desde el tablero." />
      }
    </section>

    <app-opportunity-form-drawer
      [open]="drawerOpen()"
      [saving]="saving()"
      [opportunity]="selectedOpportunity()"
      (saved)="saveOpportunity($event)"
      (closed)="closeDrawer()" />
  `,
  styles: [`
    .board-page {
      display: grid;
      gap: 1.5rem;
    }

    .hero,
    .toolbar {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: end;
      padding: 1.5rem;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: var(--shadow-soft);
    }

    .hero h1,
    .hero p {
      margin: 0;
    }

    .hero__description {
      margin-top: 0.55rem;
      max-width: 720px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .primary {
      border: 0;
      border-radius: 16px;
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
      color: white;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 14px 32px rgba(89, 212, 255, 0.2);
    }

    .stats {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .stat-card {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1.25rem;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.75);
      box-shadow: var(--shadow-soft);
    }

    .stat-card span {
      width: 12px;
      height: 48px;
      border-radius: 999px;
    }

    .stat-card strong,
    .stat-card p {
      margin: 0;
      display: block;
    }

    .stat-card p {
      color: var(--text-muted);
    }

    .toolbar {
      align-items: end;
      flex-wrap: wrap;
    }

    .toolbar label {
      min-width: 220px;
      display: grid;
      gap: 0.4rem;
      color: var(--text-main);
      font-weight: 700;
    }

    .toolbar input,
    .toolbar select {
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 16px;
      padding: 0.9rem 1rem;
      background: white;
      font: inherit;
      color: inherit;
      outline: none;
    }

    .board-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: start;
    }

    .loading-state {
      padding: 2rem;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.78);
      color: var(--text-muted);
      text-align: center;
    }

    @media (max-width: 1200px) {
      .stats,
      .board-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {
      .hero,
      .toolbar {
        padding: 1.1rem;
        flex-direction: column;
        align-items: stretch;
      }

      .stats,
      .board-grid {
        grid-template-columns: 1fr;
      }

      .toolbar label {
        min-width: 0;
      }
    }
  `]
})
export class OpportunitiesBoardPageComponent {
  private readonly opportunitiesService = inject(OpportunitiesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusOrder = OPPORTUNITY_STATUS_ORDER;
  readonly statusMeta = OPPORTUNITY_STATUS_META;
  readonly dropListIds = this.statusOrder.map((status) => `kanban-${status}`);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly drawerOpen = signal(false);
  readonly selectedOpportunityId = signal<string | null>(null);
  readonly filters = signal<OpportunityFilters>({
    search: '',
    status: 'todos',
    sortBy: 'updatedAt'
  });

  readonly selectedOpportunity = computed(() => {
    const selectedId = this.selectedOpportunityId();
    return selectedId ? this.opportunitiesService.getOpportunityById(selectedId) ?? null : null;
  });

  readonly filteredOpportunities = computed(() => {
    const { search, status, sortBy } = this.filters();
    const normalizedSearch = search.trim().toLowerCase();

    return [...this.opportunitiesService.opportunities()]
      .filter((opportunity) => {
        const matchesSearch =
          !normalizedSearch ||
          opportunity.name.toLowerCase().includes(normalizedSearch) ||
          opportunity.description.toLowerCase().includes(normalizedSearch);
        const matchesStatus = status === 'todos' || opportunity.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => this.sorter(sortBy, left, right));
  });

  readonly columns = computed(() =>
    this.statusOrder.reduce((collection, status) => {
      collection[status] = this.filteredOpportunities().filter(
        (opportunity) => opportunity.status === status
      );
      return collection;
    }, {} as Record<OpportunityStatus, Opportunity[]>)
  );

  constructor() {
    this.opportunitiesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loading.set(false));
  }

  getCountByStatus(status: OpportunityStatus): number {
    return this.opportunitiesService.opportunities().filter(
      (opportunity) => opportunity.status === status
    ).length;
  }

  updateFilters(patch: Partial<OpportunityFilters>): void {
    this.filters.update((currentFilters) => ({ ...currentFilters, ...patch }));
  }

  startCreate(): void {
    this.selectedOpportunityId.set(null);
    this.drawerOpen.set(true);
  }

  startEdit(id: string): void {
    this.selectedOpportunityId.set(id);
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.selectedOpportunityId.set(null);
  }

  openDetail(id: string): void {
    this.router.navigate(['/opportunity', id]);
  }

  saveOpportunity(payload: OpportunityUpsertPayload): void {
    this.saving.set(true);

    const request$ = this.selectedOpportunity()
      ? this.opportunitiesService.update(this.selectedOpportunity()!.id, payload)
      : this.opportunitiesService.create(payload);

    request$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.closeDrawer());
  }

  removeOpportunity(id: string): void {
    this.opportunitiesService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  handleDrop(event: CdkDragDrop<Opportunity[]>, nextStatus: OpportunityStatus): void {
    const opportunity = event.item.data as Opportunity | undefined;

    if (!opportunity) {
      return;
    }

    this.opportunitiesService
      .updateStatus(opportunity.id, nextStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private sorter(
    sortBy: OpportunityFilters['sortBy'],
    left: Opportunity,
    right: Opportunity
  ): number {
    if (sortBy === 'amount') {
      return right.amount - left.amount;
    }

    if (sortBy === 'name') {
      return left.name.localeCompare(right.name);
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  }
}
