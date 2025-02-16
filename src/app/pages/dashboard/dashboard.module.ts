import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {NgApexchartsModule} from "ng-apexcharts";


@NgModule({
  declarations: [DashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
            },
        ]),
        NgApexchartsModule,
    ],
})
export class DashboardModule {}
