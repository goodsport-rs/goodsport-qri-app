import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveyComponent } from './survey.component';


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
  ],
})
export class SurveyModule {}
