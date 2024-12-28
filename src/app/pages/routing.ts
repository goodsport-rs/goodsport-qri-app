import { Routes } from '@angular/router';
import {AdminRouting} from "./admin/admin-routing";
import {PortalGuard} from "../auth/guards/portal.guard";
import {EntrepreneursModule} from "./admin/entrepreneurs/entrepreneurs.module";

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path:'categories',
    loadChildren: () => import('./admin/categories/category.module').then((m) => m.CategoryModule),
  },
  {
    path:'entrepreneurs',
    loadChildren: () => import('./admin/entrepreneurs/entrepreneurs.module').then((m) => m.EntrepreneursModule),
  },
  {
    path:'investors',
    loadChildren: () => import('./admin/investors/investor.module').then((m) => m.InvestorModule),
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
