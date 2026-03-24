import { Routes } from '@angular/router';
import { opportunityExistsGuard } from './core/guards/opportunity-exists.guard';
import { CrmShellComponent } from './layout/crm-shell.component';
import { OpportunityDetailPageComponent } from './features/opportunities/pages/opportunity-detail-page.component';
import { OpportunitiesBoardPageComponent } from './features/opportunities/pages/opportunities-board-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CrmShellComponent,
    children: [
      {
        path: '',
        component: OpportunitiesBoardPageComponent
      },
      {
        path: 'opportunity/:id',
        canActivate: [opportunityExistsGuard],
        component: OpportunityDetailPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
