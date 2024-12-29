import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { GdprComponent } from './gdpr.component';


@NgModule({
  declarations: [
    GdprComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: GdprComponent,
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class GdprModule {}
