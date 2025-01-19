import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './details/details.component';
import {
  Step0Component,
  Step1Component,
  Step2Component,
  Step3Component,
  Step4Component,
} from './details/steps/export.steps';
import { Addreport1Component } from './addreport/addreport1/addreport1.component';
import { ReportmodalComponent } from './addreport/reportmodal/reportmodal.component';
import { Addreport2Component } from './addreport/addreport2/addreport2.component';
import { Addreport3Component } from './addreport/addreport3/addreport3.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClipboardModule } from 'ngx-clipboard';
import { SharemodalComponent } from './addreport/sharemodal/sharemodal.component';
import { ViewReportComponent } from './addreport/view-report/view-report.component';
import { QuestionerPageComponent } from './questionaire/questionaierpage/questioner-page.component';
import { MatExpansionModule } from "@angular/material/expansion";
import {InlineSVGModule} from "ng-inline-svg-2";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        NgApexchartsModule,
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
        InlineSVGModule,
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [
    ProjectsComponent,
    ProjectDetailComponent,
    Step0Component,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Addreport1Component,
    ReportmodalComponent,
    Addreport2Component,
    Addreport3Component,
    SharemodalComponent,
    ViewReportComponent,
    QuestionerPageComponent,
  ],
  exports: [
    Addreport1Component,
    Addreport2Component,
    Addreport3Component,
    ReportmodalComponent
  ],
  providers: [DatePipe,  NgbActiveModal],
})
export class ProjectsModule {}
