import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

import { StatComponent } from './stat.component';

@NgModule({
  declarations: [StatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StatComponent,
      },
    ]),
    NgApexchartsModule,
  ],
})
export class StatModule {}
