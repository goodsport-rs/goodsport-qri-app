import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


import { WidgetsModule } from '../../../_metronic/partials';
import { InvestorsComponent } from './investors.component';
import { InvestorDetailsComponent } from './details/details.component';

@NgModule({
  declarations: [InvestorsComponent, InvestorDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InvestorsComponent,
      },
      {
        path: 'details/:id',
        component: InvestorDetailsComponent,
      },
    ]),
    WidgetsModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule
  ],
})
export class InvestorModule {}
