import { Routes } from '@angular/router';
import {AdminRouting} from "./admin/admin-routing";
import {PortalGuard} from "../auth/guards/portal.guard";

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path:'admin/categories',
    loadChildren: () => import('./admin/categories/category.module').then((m) => m.CategoryModule),
  },
  {
    path:'admin/entrepreneurs',
    loadChildren: () => import('./admin/entrepreneurs/entrepreneurs.module').then((m) => m.EntrepreneursModule),
  },
  {
    path:'admin/investors',
    loadChildren: () => import('./admin/investors/investor.module').then((m) => m.InvestorModule),
  },
  {
    path:'admin/media',
    loadChildren: () => import('./admin/media/media.module').then((m) => m.MediaModule),
  },
  {
    path:'admin/partners',
    loadChildren: () => import('./admin/partners/partners.module').then((m) => m.PartnersModule),
  },
  {
    path:'admin/projects',
    loadChildren: () => import('./admin/projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path:'admin/reports',
    loadChildren: () => import('./admin/reports/reports.module').then((m) => m.ReportsModule),
  },

  {
    path:'entrepreneur/home',
    loadChildren: () => import('./entrepreneure/home/home.module').then((m) => m.HomeModule),
  },
  {
    path:'entrepreneur/profile',
    loadChildren: () => import('./entrepreneure/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path:'entrepreneur/projects',
    loadChildren: () => import('./entrepreneure/projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path:'entrepreneur/courses',
    loadChildren: () => import('./entrepreneure/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path:'entrepreneur/surveys',
    loadChildren: () => import('./entrepreneure/surveys/survey.module').then((m) => m.SurveyModule),
  },
  {
    path:'entrepreneur/policy',
    loadChildren: () => import('../modules/publiclinks/gdpr/gdpr.module').then((m) => m.GdprModule),
  },
  {
    path:'entrepreneur/gss',
    loadChildren: () => import('../modules/publiclinks/companyInfo/company-Info.module').then((m) => m.CompanyInfoModule),
  },

  {
    path:'admin/investments',
    loadChildren: () => import('./admin/investments/investment.module').then((m) => m.InvestmentModule),
  },
  {
    path:'admin/questionnaires',
    loadChildren: () => import('./admin/questionnaires/questionnaires.module').then((m) => m.QuestionnairesModule),
  },

  {
    path: 'admin/users',
    loadChildren: () => import('./admin/users/users.module').then((m) => m.UsersModule),
  },  {
    path: 'investor/home',
    loadChildren: () => import('./investor/home/invest-project-listing.module').then((m) =>  m.InvestProjectListingModule),
  },

  {
    path: 'investor/projects',
    loadChildren: () => import('./investor/projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path: 'investor/investments',
    loadChildren: () => import('./investor/investments/investment.module').then((m) => m.InvestmentModule),
  },
  {
    path: 'investor/profile',
    loadChildren: () => import('./investor/profile/profile.module').then((m) => m.ProfileModule),
  },

  {
    path: 'admin',
    canActivate: [PortalGuard],
    children: AdminRouting,
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
];

export { Routing };
