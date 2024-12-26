import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoModule } from 'ngx-timeago';

import { WidgetsModule } from '../../../_metronic/partials';
import { InvestmentComponent } from './investment.component';


@NgModule({
  declarations: [InvestmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InvestmentComponent,
      },
    ]),
    WidgetsModule,
    FormsModule,
    NgbModule,
    TimeagoModule.forChild(),
  ],
})
export class InvestmentModule {}
