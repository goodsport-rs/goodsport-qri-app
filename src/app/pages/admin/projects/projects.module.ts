import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './details/details.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CardsModule } from '../../../_metronic/partials';
import { ViewgriComponent } from './details/viewgri/viewgri.component';
import { Step0Component } from './details/steps/step0/step0.component';
import { Step1Component } from './details/steps/step1/step1.component';
import { Step2Component } from './details/steps/step2/step2.component';
import { Step3Component } from './details/steps/step3/step3.component';
import { Step4Component } from './details/steps/step4/step4.component';
import { QuestionnaireText1Component } from './details/questionnaire/questionnaire-text/questionnaire-text1.component';
import { AdmingrireportComponent } from './details/admingrireport/admingrireport.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ReportchartsComponent} from "./details/reportcharts/reportcharts.component";
import {NgApexchartsModule} from "ng-apexcharts";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    MatExpansionModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectsComponent,
      },
      {
        path: 'details/:id',
        component: ProjectDetailComponent,
      },
    ]),
    NgbModule,
    NgbPaginationModule,
    NgbAccordionModule,
    InlineSVGModule,
    CardsModule,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatColumnDef,
    MatButton,
    MatProgressSpinner,
    MatSelect,
    MatOption,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatTabGroup,
    MatTab,
    NgApexchartsModule
  ],
    declarations: [
        ProjectsComponent,
        ProjectDetailComponent,
        Step0Component,
        Step1Component,
        Step2Component,
        QuestionnaireText1Component,
        Step3Component,
        Step4Component,
        ViewgriComponent,
        AdmingrireportComponent,
        ReportchartsComponent
    ],
  providers: [DatePipe],
})
export class ProjectsModule { }
