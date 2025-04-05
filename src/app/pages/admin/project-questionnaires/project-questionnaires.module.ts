import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {ProjectQuestionnairesComponent} from "./project-questionnaires.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectQuestionnairesComponent,
      },
    ]),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ProjectQuestionnairesComponent,
  ],
})
export class ProjectQuestionnairesModule {}
