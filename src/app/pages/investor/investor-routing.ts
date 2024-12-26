import { Routes } from '@angular/router';

const InvestorRouting: Routes = [
  {
    path: '',
    redirectTo: '/investor/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./stat/stat.module').then((m) => m.StatModule),
  },
  {
    path: 'projects-ongoing/:id',
    loadChildren: () => import('./home/invest-project-listing.module').then((m) => m.InvestProjectListingModule),
  },
  {
    path: 'projects-latest/:id',
    loadChildren: () => import('./home/invest-project-listing.module').then((m) => m.InvestProjectListingModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path: 'investments',
    loadChildren: () =>
      import('./investments/investment.module').then((m) => m.InvestmentModule),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { InvestorRouting };
