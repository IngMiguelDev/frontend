import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-crm-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="crm-shell" [class.sidebar-collapsed]="!sidebarOpen()">
      @if (sidebarOpen() && isMobileView()) {
        <button class="sidebar-backdrop" type="button" (click)="toggleSidebar(false)"></button>
      }

      <aside class="sidebar" [class.sidebar--open]="sidebarOpen()">
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

      <button
        class="sidebar-toggle"
        type="button"
        (click)="toggleSidebar()"
        [class.sidebar-toggle--collapsed]="!sidebarOpen()"
        [attr.aria-label]="sidebarOpen() ? 'Ocultar barra lateral' : 'Mostrar barra lateral'">
        <span class="sidebar-toggle__chevrons" [class.is-collapsed]="!sidebarOpen()">
          <span></span>
          <span></span>
        </span>
      </button>

      <main class="content">
        <header class="topbar">
          <div class="topbar__heading">
            <div>
            <p class="eyebrow">CRM Enterprise UI</p>
            <h2>Gestión de oportunidades</h2>
            </div>
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
      position: relative;
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      min-height: 100vh;
      transition: grid-template-columns 180ms ease;
      background:
        radial-gradient(circle at top left, rgba(109, 140, 255, 0.18), transparent 30%),
        linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
    }

    .crm-shell.sidebar-collapsed {
      grid-template-columns: 0 minmax(0, 1fr);
    }

    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      z-index: 30;
      border: 0;
      background: rgba(9, 18, 44, 0.32);
      backdrop-filter: blur(4px);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1.5rem;
      border-right: 1px solid rgba(15, 23, 42, 0.08);
      background: rgba(9, 18, 44, 0.92);
      color: #dce6ff;
      overflow: hidden;
      transition: transform 180ms ease, opacity 180ms ease;
    }

    .crm-shell.sidebar-collapsed .sidebar {
      opacity: 0;
      pointer-events: none;
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

    .sidebar-toggle {
      position: absolute;
      top: 1rem;
      left: 248px;
      z-index: 45;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 14px;
      background: #ff3b30;
      color: white;
      box-shadow: 0 18px 34px rgba(255, 59, 48, 0.24);
      cursor: pointer;
      transition: left 180ms ease, transform 180ms ease, background 180ms ease;
    }

    .sidebar-toggle:hover {
      transform: translateY(-1px);
    }

    .crm-shell.sidebar-collapsed .sidebar-toggle {
      left: 1rem;
    }

    .sidebar-toggle__chevrons {
      position: relative;
      display: block;
      width: 20px;
      height: 14px;
    }

    .sidebar-toggle__chevrons span {
      position: absolute;
      top: 50%;
      width: 9px;
      height: 9px;
      border-top: 2px solid currentColor;
      border-left: 2px solid currentColor;
      transform: translateY(-50%) rotate(-45deg);
    }

    .sidebar-toggle__chevrons span:first-child {
      left: 1px;
    }

    .sidebar-toggle__chevrons span:last-child {
      right: 1px;
    }

    .sidebar-toggle__chevrons.is-collapsed span {
      transform: translateY(-50%) rotate(135deg);
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

    .topbar__heading {
      display: flex;
      align-items: center;
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

      .sidebar-toggle {
        left: 1rem;
      }

      .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 40;
        width: min(320px, 86vw);
        transform: translateX(-100%);
        gap: 1rem;
        padding-bottom: 1rem;
      }

      .sidebar.sidebar--open {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }

      .crm-shell.sidebar-collapsed .sidebar {
        transform: translateX(-100%);
      }
    }

    @media (max-width: 720px) {
      .topbar {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.5rem 1rem 1rem;
      }

      .topbar__heading {
        padding-left: 3.5rem;
      }

      .page {
        padding: 0 1rem 1rem;
      }
    }
  `]
})
export class CrmShellComponent {
  readonly sidebarOpen = signal(true);

  isMobileView(): boolean {
    return typeof window !== 'undefined' ? window.innerWidth <= 1040 : false;
  }

  toggleSidebar(forceState?: boolean): void {
    this.sidebarOpen.set(forceState ?? !this.sidebarOpen());
  }
}
