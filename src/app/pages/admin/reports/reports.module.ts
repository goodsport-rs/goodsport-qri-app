import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoModule } from 'ngx-timeago';

import { WidgetsModule } from '../../../_metronic/partials';
import { ReportsComponent } from './reports.component';


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReportsComponent,
      },
    ]),
    WidgetsModule,
    FormsModule,
    NgbModule,
    TimeagoModule.forChild(),
    ReactiveFormsModule,
  ],
})
export class ReportsModule {}
