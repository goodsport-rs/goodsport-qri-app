import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './details/details.component';
import {InlineSVGModule} from "ng-inline-svg-2";



@NgModule({
  declarations: [ProjectsComponent, ProjectDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectsComponent,
      },
      {
        path: 'details/:id',
        component: ProjectDetailComponent,
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,

  ],
})
export class ProjectsModule {}
