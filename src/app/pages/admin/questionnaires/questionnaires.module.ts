import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuestionnairesComponent } from './questionnaires.component';
import { QuestionnaireDetailComponent } from './details/details.component';
import { QuestionnaireSettingsComponent } from './settings/settings.component';
import { AddquestionComponent } from './createquestions/addquestion/addquestion.component';
import { QstgroupsComponent } from './qstgroups/qstgroups.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {InlineSVGModule} from "ng-inline-svg-2";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuestionnairesComponent,
      },
      {
        path: 'details/:id',
        component: QstgroupsComponent,
      },
      {
        path: 'settings',
        component: QuestionnaireSettingsComponent,
      },
    ]),
    NgbModule,
    MatExpansionModule,
    DragDropModule,
  ],
  declarations: [
    QuestionnairesComponent,
    QuestionnaireDetailComponent,
    QuestionnaireSettingsComponent,
    AddquestionComponent,
    QstgroupsComponent,
  ],
  providers: [DatePipe],
})
export class QuestionnairesModule {}
