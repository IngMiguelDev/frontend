import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-crm-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="crm-shell">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand__logo">GT</span>
          <div>
            <h1>Growtek CRM</h1>
            <p>Pipeline comercial</p>
          </div>
        </div>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Oportunidades
          </a>
        </nav>

        <section class="sidebar-card">
          <p class="sidebar-card__label">Arquitectura</p>
          <strong>Angular 17 standalone</strong>
          <span>Mocks desacoplados, signals, RxJS y rutas limpias.</span>
        </section>
      </aside>

      <main class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">CRM Enterprise UI</p>
            <h2>Gestión de oportunidades</h2>
          </div>

          <div class="topbar__meta">
            <span>Pipeline</span>
            <span class="dot"></span>
            <span>Frontend only</span>
          </div>
        </header>

        <section class="page">
          <router-outlet />
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .crm-shell {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(109, 140, 255, 0.18), transparent 30%),
        linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1.5rem;
      border-right: 1px solid rgba(15, 23, 42, 0.08);
      background: rgba(9, 18, 44, 0.92);
      color: #dce6ff;
    }

    .brand {
      display: flex;
      gap: 0.9rem;
      align-items: center;
    }

    .brand__logo {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6d8cff, #59d4ff);
      color: white;
      font-weight: 800;
    }

    .brand h1,
    .topbar h2 {
      margin: 0;
    }

    .brand p,
    .topbar p {
      margin: 0.15rem 0 0;
      color: rgba(220, 230, 255, 0.72);
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav a {
      padding: 0.95rem 1rem;
      border-radius: 16px;
      color: inherit;
      font-weight: 600;
      text-decoration: none;
      transition: 180ms ease;
    }

    .nav a:hover,
    .nav a.active {
      background: rgba(109, 140, 255, 0.22);
    }

    .sidebar-card {
      display: grid;
      gap: 0.45rem;
      padding: 1.25rem;
      border: 1px solid rgba(220, 230, 255, 0.12);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(220, 230, 255, 0.78);
    }

    .sidebar-card__label,
    .eyebrow {
      margin: 0;
      color: var(--accent-strong);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 2rem 2rem 1rem;
    }

    .topbar__meta {
      display: flex;
      gap: 0.6rem;
      align-items: center;
      padding: 0.8rem 1rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.75);
      color: var(--text-muted);
      font-size: 0.92rem;
      box-shadow: var(--shadow-soft);
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3ecf8e;
    }

    .page {
      flex: 1;
      padding: 0 2rem 2rem;
    }

    @media (max-width: 1040px) {
      .crm-shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        gap: 1rem;
        padding-bottom: 1rem;
      }
    }

    @media (max-width: 720px) {
      .topbar {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.5rem 1rem 1rem;
      }

      .page {
        padding: 0 1rem 1rem;
      }
    }
  `]
})
export class CrmShellComponent {}
