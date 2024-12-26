import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WidgetsModule } from '../../../_metronic/partials';
import { CategoryComponent } from './category.component';


@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryComponent,
      },

    ]),
    WidgetsModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ],
})
export class CategoryModule {}
