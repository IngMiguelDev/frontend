import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpportunitiesService } from '../services/opportunities.service';
import { OpportunityTimelineComponent } from '../components/opportunity-timeline.component';
import { OPPORTUNITY_STATUS_META } from '../../../shared/utils/opportunity.util';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-opportunity-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    StatusLabelPipe,
    OpportunityTimelineComponent
  ],
  template: `
    @if (opportunity(); as opportunity) {
      <section class="detail-page">
        <a routerLink="/" class="back-link">Volver al tablero</a>

        <section class="detail-hero">
          <div>
            <p class="eyebrow">Opportunity detail</p>
            <h1>{{ opportunity.name }}</h1>
            <p class="detail-hero__description">{{ opportunity.description }}</p>
          </div>

          <div class="detail-hero__metrics">
            <strong>{{ opportunity.amount | currency:'USD':'symbol':'1.0-0' }}</strong>
            <span>{{ opportunity.status | statusLabel }}</span>
          </div>
        </section>

        <section class="detail-grid">
          <article class="overview card">
            <div class="section-title">
              <div>
                <p class="eyebrow">Visión general</p>
                <h2>Estado actual</h2>
              </div>
            </div>

            <div class="overview__rows">
              <div>
                <span>Creación</span>
                <strong>{{ opportunity.createdAt | date:'dd MMM yyyy' }}</strong>
              </div>
              <div>
                <span>Última actualización</span>
                <strong>{{ opportunity.updatedAt | date:'dd MMM yyyy, HH:mm' }}</strong>
              </div>
              <div>
                <span>Cierre estimado</span>
                <strong>{{ opportunity.expectedCloseDate | date:'dd MMM yyyy' }}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{{ opportunity.status | statusLabel }}</strong>
              </div>
            </div>

            <div class="progress">
              <div class="progress__label">
                <span>Avance de la oportunidad</span>
                <strong>{{ progress() }}%</strong>
              </div>
              <div class="progress__track">
                <div class="progress__bar" [style.width.%]="progress()"></div>
              </div>
            </div>
          </article>

          <article class="card notes">
            <div class="section-title">
              <div>
                <p class="eyebrow">Notas</p>
                <h2>Seguimiento comercial</h2>
              </div>
            </div>

            <form class="note-form" [formGroup]="noteForm" (ngSubmit)="addNote()">
              <textarea
                rows="4"
                formControlName="content"
                placeholder="Agrega una nota, siguiente paso o contexto del cliente"></textarea>
              <button type="submit" [disabled]="noteForm.invalid">Agregar nota</button>
            </form>

            <section class="notes-list">
              @for (note of opportunity.notes; track note.id) {
                <article class="note">
                  <div class="note__meta">
                    <strong>{{ note.author }}</strong>
                    <span>{{ note.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
                  </div>
                  <p>{{ note.content }}</p>
                </article>
              }
            </section>
          </article>
        </section>

        <article class="card history">
          <div class="section-title">
            <div>
              <p class="eyebrow">Historial</p>
              <h2>Timeline de actividades</h2>
            </div>
          </div>

          <app-opportunity-timeline [activities]="opportunity.activities" />
        </article>
      </section>
    }
  `,
  styles: [`
    .detail-page {
      display: grid;
      gap:1.5rem;
    }

    .back-link {
      color: var(--accent-strong);
      text-decoration: none;
    }

    .detail-hero,
    .card {
      padding: 1.5rem;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: var(--shadow-soft);
    }

    .detail-hero {
      display: flex;
      justify-content: space-between;
      gap:1.5rem;
      align-items: flex-start;
    }

    .detail-hero__description {
      margin-top: 0.65rem;
      max-width: 720px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .detail-hero__metrics {
      display: grid;
      gap: 0.45rem;
      padding: 1rem;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(109, 140, 255, 0.12), rgba(89, 212, 255, 0.08));
    }

    .detail-hero__metrics strong {
      color: var(--text-main);
      font-size: 1.9rem;
    }

    .detail-hero__metrics span,
    .overview__rows span,
    .progress__label span,
    .note__meta span {
      color: var(--text-muted);
    }

    .detail-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    }

    .overview__rows {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-bottom: 1.5rem;
    }

    .overview__rows div {
      display: grid;
      gap: 0.25rem;
      padding: 1rem;
      border-radius: 20px;
      background: rgba(248, 251, 255, 0.95);
    }

    .progress {
      display: grid;
      gap: 0.75rem;
    }

    .progress__label {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .progress__track {
      height: 14px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
    }

    .progress__bar {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
    }

    .note-form {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .note-form textarea {
      width: 100%;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 18px;
      padding: 0.95rem 1rem;
      background: white;
      font: inherit;
      color: inherit;
      outline: none;
    }

    .note-form button {
      justify-self: end;
      border: 0;
      border-radius: 16px;
      padding: 0.9rem 1.15rem;
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
      color: white;
      font-weight: 800;
      cursor: pointer;
    }

    .notes-list {
      display: grid;
      gap: 0.9rem;
    }

    .note {
      padding: 1rem;
      border-radius: 20px;
      background: rgba(248, 251, 255, 0.95);
    }

    .note__meta {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.45rem;
    }

    .note p {
      margin: 0;
      line-height: 1.55;
    }

    @media (max-width: 920px) {
      .detail-hero,
      .detail-grid {
        grid-template-columns: 1fr;
        flex-direction: column;
      }

      .overview__rows {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OpportunityDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly opportunitiesService = inject(OpportunitiesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly opportunityId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly opportunity = computed(() => this.opportunitiesService.getOpportunityById(this.opportunityId()));
  readonly progress = computed(() => {
    const opportunity = this.opportunity();
    return opportunity ? OPPORTUNITY_STATUS_META[opportunity.status].progress : 0;
  });

  readonly noteForm = this.formBuilder.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(4)]]
  });

  addNote(): void {
    const opportunityId = this.opportunityId();

    if (!opportunityId || this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    this.opportunitiesService
      .addNote(opportunityId, this.noteForm.getRawValue().content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((note) => {
        if (!note) {
          this.router.navigate(['/']);
          return;
        }

        this.noteForm.reset();
      });
  }
}
