import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { Opportunity, OpportunityStatus } from '../../../core/models/opportunity.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { OpportunityCardComponent } from './opportunity-card.component';

@Component({
  selector: 'app-opportunity-kanban-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, OpportunityCardComponent, EmptyStateComponent],
  template: `
    <section class="column">
      <header class="column__header">
        <div>
          <p>{{ subtitle() }}</p>
          <h3>{{ title() }}</h3>
        </div>

        <span>{{ opportunities().length }}</span>
      </header>

      <div
        class="column__body"
        cdkDropList
        [cdkDropListData]="opportunities()"
        [cdkDropListConnectedTo]="connectedTo()"
        [id]="dropListId()"
        (cdkDropListDropped)="dropped.emit({ event: $event, status: status() })">
        @if (opportunities().length) {
          @for (opportunity of opportunities(); track opportunity.id) {
            <div cdkDrag [cdkDragData]="opportunity">
              <app-opportunity-card
                [opportunity]="opportunity"
                (opened)="opened.emit($event)"
                (edited)="edited.emit($event)"
                (deleted)="deleted.emit($event)" />
            </div>
          }
        } @else {
          <app-empty-state
            eyebrow="Columna vacía"
            title="Sin oportunidades"
            description="Arrastra una tarjeta aquí o crea una nueva." />
        }
      </div>
    </section>
  `,
  styles: [`
    .column {
      display: grid;
      gap: 1rem;
      min-width: 280px;
      padding: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.65);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .column__header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: flex-start;
    }

    .column__header p,
    .column__header h3 {
      margin: 0;
    }

    .column__header p {
      color: var(--text-muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .column__header h3 {
      color: var(--text-main);
      font-size: 1.1rem;
    }

    .column__header span {
      display: inline-grid;
      place-items: center;
      min-width: 36px;
      height: 36px;
      padding: 0 0.8rem;
      border-radius: 999px;
      background: rgba(109, 140, 255, 0.12);
      color: var(--accent-strong);
      font-weight: 800;
    }

    .column__body {
      display: grid;
      gap: 1rem;
      min-height: 360px;
      align-content: start;
    }
  `]
})
export class OpportunityKanbanColumnComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly status = input.required<OpportunityStatus>();
  readonly opportunities = input.required<Opportunity[]>();
  readonly connectedTo = input.required<string[]>();
  readonly dropListId = input.required<string>();

  readonly dropped = output<{ event: CdkDragDrop<Opportunity[]>; status: OpportunityStatus }>();
  readonly opened = output<string>();
  readonly edited = output<string>();
  readonly deleted = output<string>();
}
