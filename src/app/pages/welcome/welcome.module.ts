import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {NgApexchartsModule} from "ng-apexcharts";
import {WelcomeComponent} from "./welcome.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: WelcomeComponent,
      },
    ]),
    NgApexchartsModule,
    WelcomeComponent,
  ],
})
export class WelcomeModule {}
