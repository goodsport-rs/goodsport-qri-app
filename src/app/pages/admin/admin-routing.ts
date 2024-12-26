import {Routes} from '@angular/router';

// import { ProfileComponent } from '../investor/profile/profile.component';

const AdminRouting: Routes = [
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full',
  },
  {
    path:'categories',
    loadChildren: () =>
      import('./categories/category.module').then((m) => m.CategoryModule),
  },
  {
    path: 'entrepreneurs',
    loadChildren: () =>
      import('./entrepreneurs/entrepreneurs.module').then(
        (m) => m.EntrepreneursModule
      ),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

export {AdminRouting};
