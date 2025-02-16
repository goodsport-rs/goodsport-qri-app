import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HomeComponent } from './home.component';


import { ProjectDetailComponent } from './details/details.component';
import {
  Step0Component,
  Step1Component,
  Step2Component,
  Step3Component,
  Step4Component,
} from './details/steps/export.steps';

@NgModule({
  declarations: [
    HomeComponent,
    ProjectDetailComponent,
    Step0Component,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
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
        component: ProjectDetailComponent,
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
