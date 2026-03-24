import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Opportunity } from '../../../core/models/opportunity.model';
import { CurrencyCompactPipe } from '../../../shared/pipes/currency-compact.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';
import { OPPORTUNITY_STATUS_META } from '../../../shared/utils/opportunity.util';

@Component({
  selector: 'app-opportunity-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyCompactPipe,
    RelativeTimePipe,
    StatusLabelPipe,
    DatePipe
  ],
  template: `
    <article
      class="card"
      [style.--status-accent]="statusMeta().accent"
      (click)="opened.emit(opportunity().id)">
      <div class="card__header">
        <span class="status-pill">{{ opportunity().status | statusLabel }}</span>

        <div class="actions">
          <button type="button" (click)="handleEdit($event)">Editar</button>
          <button type="button" class="danger" (click)="handleDelete($event)">Eliminar</button>
        </div>
      </div>

      <div class="card__body">
        <h3>{{ opportunity().name }}</h3>
        <strong>{{ opportunity().amount | currencyCompact:'USD' }}</strong>
        <p>{{ opportunity().description }}</p>
      </div>

      <footer class="card__footer">
        <div>
          <span>Última actividad</span>
          <strong>{{ opportunity().lastActivityAt | relativeTime }}</strong>
        </div>

        <div>
          <span>Cierre estimado</span>
          <strong>{{ opportunity().expectedCloseDate | date:'dd MMM yyyy' }}</strong>
        </div>
      </footer>
    </article>
  `,
  styles: [`
    .card {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: var(--shadow-soft);
      cursor: pointer;
      transition: transform 180ms ease, box-shadow 180ms ease;
      border-top: 4px solid var(--status-accent);
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-strong);
    }

    .card__header,
    .card__footer,
    .actions {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: center;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-accent) 14%, white);
      color: var(--status-accent);
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .actions button {
      border: 0;
      background: transparent;
      color: var(--text-muted);
      font-weight: 700;
      cursor: pointer;
    }

    .actions .danger {
      color: #c2410c;
    }

    .card__body h3,
    .card__body p,
    .card__body strong {
      margin: 0;
    }

    .card__body {
      display: grid;
      gap: 0.45rem;
    }

    .card__body h3 {
      color: var(--text-main);
      font-size: 1.05rem;
    }

    .card__body strong {
      color: #09122c;
      font-size: 1.25rem;
    }

    .card__body p,
    .card__footer span {
      color: var(--text-muted);
      line-height: 1.45;
    }

    .card__footer {
      font-size: 0.84rem;
    }

    .card__footer div {
      display: grid;
      gap: 0.15rem;
    }

    .card__footer strong {
      color: var(--text-main);
    }
  `]
})
export class OpportunityCardComponent {
  readonly opportunity = input.required<Opportunity>();
  readonly opened = output<string>();
  readonly edited = output<string>();
  readonly deleted = output<string>();

  readonly statusMeta = () => OPPORTUNITY_STATUS_META[this.opportunity().status];

  handleEdit(event: Event): void {
    event.stopPropagation();
    this.edited.emit(this.opportunity().id);
  }

  handleDelete(event: Event): void {
    event.stopPropagation();
    this.deleted.emit(this.opportunity().id);
  }
}
