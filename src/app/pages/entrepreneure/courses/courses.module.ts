import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoursesComponent } from './courses.component';
import { WidgetsModule } from '../../../_metronic/partials';

@NgModule({
  declarations: [CoursesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CoursesComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class CoursesModule {}
