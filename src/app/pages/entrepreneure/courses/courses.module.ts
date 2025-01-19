import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoursesComponent } from './courses.component';

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
  ],
})
export class CoursesModule {}
