import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

import { StatComponent } from './stat.component';
import { WidgetsModule } from '../../../_metronic/partials';

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
    WidgetsModule,
    NgApexchartsModule,
  ],
})
export class StatModule {}
