import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Opportunity, OpportunityUpsertPayload } from '../../../core/models/opportunity.model';

@Component({
  selector: 'app-opportunity-form-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (open()) {
      <div class="drawer-backdrop" (click)="closed.emit()"></div>

      <aside class="drawer">
        <header class="drawer__header">
          <div>
            <p>{{ opportunity() ? 'Edición' : 'Nueva oportunidad' }}</p>
            <h3>{{ opportunity() ? 'Actualizar oportunidad' : 'Crear oportunidad' }}</h3>
          </div>

          <button type="button" (click)="closed.emit()">Cerrar</button>
        </header>

        <form class="drawer__form" [formGroup]="form" (ngSubmit)="submit()">
          <label>
            <span>Nombre</span>
            <input type="text" formControlName="name" placeholder="Ej. Implementación regional" />
            @if (form.controls.name.invalid && form.controls.name.touched) {
              <small>El nombre es obligatorio.</small>
            }
          </label>

          <label>
            <span>Valor</span>
            <input type="number" formControlName="amount" placeholder="120000" />
            @if (form.controls.amount.invalid && form.controls.amount.touched) {
              <small>Ingresa un valor mayor a 0.</small>
            }
          </label>

          <label>
            <span>Fecha estimada de cierre</span>
            <input type="date" formControlName="expectedCloseDate" />
            @if (form.controls.expectedCloseDate.invalid && form.controls.expectedCloseDate.touched) {
              <small>Selecciona la fecha estimada.</small>
            }
          </label>

          <label>
            <span>Descripción</span>
            <textarea
              rows="5"
              formControlName="description"
              placeholder="Describe contexto, stakeholders y siguiente paso."></textarea>
            @if (form.controls.description.invalid && form.controls.description.touched) {
              <small>La descripción debe tener al menos 15 caracteres.</small>
            }
          </label>

          <footer class="drawer__footer">
            <button type="button" class="ghost" (click)="closed.emit()">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Guardando...' : (opportunity() ? 'Actualizar' : 'Crear') }}
            </button>
          </footer>
        </form>
      </aside>
    }
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(9, 18, 44, 0.38);
      backdrop-filter: blur(6px);
      z-index: 50;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 60;
      width: min(460px, 100%);
      height: 100vh;
      padding: 1.5rem;
      background: #fbfdff;
      box-shadow: -12px 0 40px rgba(15, 23, 42, 0.16);
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 1.25rem;
    }

    .drawer__header,
    .drawer__footer {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }

    .drawer__header p,
    .drawer__header h3 {
      margin: 0;
    }

    .drawer__header p {
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      font-weight: 800;
    }

    .drawer__header button,
    .drawer__footer button {
      border: 0;
      border-radius: 14px;
      padding: 0.9rem 1.1rem;
      font-weight: 700;
      cursor: pointer;
    }

    .drawer__header button,
    .drawer__footer .ghost {
      background: rgba(15, 23, 42, 0.06);
      color: var(--text-main);
    }

    .drawer__footer button:last-child {
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
      color: white;
    }

    .drawer__form {
      display: grid;
      gap: 1rem;
      align-content: start;
    }

    label {
      display: grid;
      gap: 0.45rem;
      color: var(--text-main);
      font-weight: 600;
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 16px;
      padding: 0.95rem 1rem;
      background: white;
      font: inherit;
      color: inherit;
      outline: none;
    }

    input:focus,
    textarea:focus {
      border-color: #6d8cff;
      box-shadow: 0 0 0 4px rgba(109, 140, 255, 0.15);
    }

    small {
      color: #c2410c;
    }
  `]
})
export class OpportunityFormDrawerComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly open = input(false);
  readonly saving = input(false);
  readonly opportunity = input<Opportunity | null>(null);
  readonly saved = output<OpportunityUpsertPayload>();
  readonly closed = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    expectedCloseDate: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(15)]]
  });

  constructor() {
    effect(() => {
      const opportunity = this.opportunity();

      if (opportunity) {
        this.form.reset({
          name: opportunity.name,
          amount: opportunity.amount,
          expectedCloseDate: opportunity.expectedCloseDate,
          description: opportunity.description
        });
      } else {
        this.form.reset({
          name: '',
          amount: 0,
          expectedCloseDate: '',
          description: ''
        });
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.saved.emit(this.form.getRawValue());
  }
}
