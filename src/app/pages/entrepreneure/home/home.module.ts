import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'details/:id',
        redirectTo: '/entrepreneur/projects/details/:id',
        pathMatch: 'full',
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
