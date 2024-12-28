import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { InvestorRouting } from './investor-routing';
@NgModule({
  imports: [
    NgModule,
    CommonModule,
    InvestorRouting,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

  ],
  declarations: [],
  providers: [],
})
export class InvestorModule {}
