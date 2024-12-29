import {Routes} from '@angular/router';

const EntrepreneureRoutingModule: Routes = [
  {
    path: '',
    redirectTo: '/entrepreneure/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'surveys',
    loadChildren: () =>
      import('./surveys/survey.module').then((m) => m.SurveyModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('../../modules/publiclinks/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'gdpr',
    loadChildren: () =>
      import('../../modules/publiclinks/gdpr/gdpr.module').then((m) => m.GdprModule),
  },
  {
    path: 'goodsport',
    loadChildren: () =>
      import('../../modules/publiclinks/companyInfo/company-Info.module').then((m) => m.CompanyInfoModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export {EntrepreneureRoutingModule};
