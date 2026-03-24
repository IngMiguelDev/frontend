import { CommonModule, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { OpportunityActivity } from '../../../core/models/opportunity.model';

@Component({
  selector: 'app-opportunity-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <section class="timeline">
      @for (activity of activities(); track activity.id) {
        <article class="timeline__item">
          <div class="timeline__dot"></div>

          <div class="timeline__content">
            <div class="timeline__meta">
              <strong>{{ activity.title }}</strong>
              <span>{{ activity.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
            </div>
            <p>{{ activity.description }}</p>
          </div>
        </article>
      }
    </section>
  `,
  styles: [`
    .timeline {
      display: grid;
      gap: 1rem;
    }

    .timeline__item {
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 1rem;
    }

    .timeline__dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
      margin-top: 0.25rem;
      box-shadow: 0 0 0 6px rgba(109, 140, 255, 0.12);
    }

    .timeline__content {
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .timeline__meta {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: baseline;
      margin-bottom: 0.35rem;
    }

    .timeline__meta span,
    .timeline__content p {
      color: var(--text-muted);
    }

    .timeline__content p {
      margin: 0;
      line-height: 1.55;
    }

    @media (max-width: 720px) {
      .timeline__meta {
        flex-direction: column;
      }
    }
  `]
})
export class OpportunityTimelineComponent {
  readonly activities = input.required<OpportunityActivity[]>();
}
