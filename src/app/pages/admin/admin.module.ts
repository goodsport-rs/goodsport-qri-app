import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminRouting } from './admin-routing';
import { AdminService } from './admin.service';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    NgModule,
    CommonModule,
    AdminRouting,
    BrowserModule,
    BrowserAnimationsModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AdminService],
  declarations: [],
})
export class InvestorModule {}
