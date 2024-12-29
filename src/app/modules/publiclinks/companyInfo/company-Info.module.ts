import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { CompanyInfoComponent } from './company-info.component';


@NgModule({
  declarations: [
    CompanyInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CompanyInfoComponent,
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class CompanyInfoModule {}
