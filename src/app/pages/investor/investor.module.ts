import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { InvestorRouting } from './investor-routing';
@NgModule({
  imports: [
    NgModule,
    CommonModule,
    InvestorRouting,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    InlineSVGModule,
  ],
  declarations: [],
  providers: [],
})
export class InvestorModule {}
