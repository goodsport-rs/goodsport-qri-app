import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SurveyComponent } from './survey.component';
import { WidgetsModule } from '../../../_metronic/partials';

@NgModule({
  declarations: [SurveyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SurveyComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class SurveyModule {}
