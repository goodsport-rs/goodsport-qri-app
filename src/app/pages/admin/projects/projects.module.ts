import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbAccordionModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './details/details.component';
import {InlineSVGModule} from "ng-inline-svg-2";
import {CardsModule} from "../../../_metronic/partials";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

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
    ],
  declarations: [
    ProjectsComponent,
    ProjectDetailComponent,
  ],
  providers: [DatePipe],
})
export class ProjectsModule {}
