import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OpportunitiesService } from '../../features/opportunities/services/opportunities.service';

export const opportunityExistsGuard: CanActivateFn = (route) => {
  const opportunitiesService = inject(OpportunitiesService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (id && opportunitiesService.getOpportunityById(id)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
