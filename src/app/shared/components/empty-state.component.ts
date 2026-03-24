import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="empty-state">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
    </section>
  `,
  styles: [`
    .empty-state {
      padding: 2rem 1.5rem;
      border: 1px dashed rgba(109, 140, 255, 0.35);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.8);
      text-align: center;
      color: var(--text-muted);
    }

    .eyebrow {
      margin: 0 0 0.35rem;
      color: var(--accent-strong);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h3 {
      margin: 0 0 0.5rem;
      color: var(--text-main);
      font-size: 1.1rem;
    }

    p {
      margin: 0;
      line-height: 1.5;
    }
  `]
})
export class EmptyStateComponent {
  readonly eyebrow = input('Sin resultados');
  readonly title = input('Nada para mostrar');
  readonly description = input('Ajusta los filtros o crea una nueva oportunidad.');
}
