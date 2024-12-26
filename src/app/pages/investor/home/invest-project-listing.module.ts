import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WidgetsModule } from '../../../_metronic/partials';
import { InvestProjectListingComponent } from './invest-project-listing.component';
import { DetailsComponent } from './details/details.component';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [InvestProjectListingComponent, DetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InvestProjectListingComponent,
      },
      {
        path: 'details/:id',
        component: DetailsComponent,
      },
    ]),
    WidgetsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class InvestProjectListingModule {}
