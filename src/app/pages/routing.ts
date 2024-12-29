import { Routes } from '@angular/router';
import {AdminRouting} from "./admin/admin-routing";
import {PortalGuard} from "../auth/guards/portal.guard";

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
    path:'admin/investments',
    loadChildren: () => import('./admin/investments/investment.module').then((m) => m.InvestmentModule),
  },
  {
    path:'admin/questionnaires',
    loadChildren: () => import('./admin/questionnaires/questionnaires.module').then((m) => m.QuestionnairesModule),
  },

  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
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
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];

export { Routing };
