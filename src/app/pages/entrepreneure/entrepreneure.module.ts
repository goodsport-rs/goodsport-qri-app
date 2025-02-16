import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EntrepreneureRoutingModule } from './entrepreneure-routing.module';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import {InlineSVGModule} from "ng-inline-svg-2";
import {SharedModule} from "../../_metronic/shared/shared.module";
import {NgxMaskDirective} from "ngx-mask";
@NgModule({
    imports: [
        NgModule,
        CommonModule,
        EntrepreneureRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        InlineSVGModule,
        SharedModule,
        NgxMaskDirective,
    ],
  declarations: [HomeComponent, ProfileComponent],
  providers: [],
})
export class EntrepreneureModule {}
