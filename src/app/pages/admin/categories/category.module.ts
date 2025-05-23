import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ],
})
export class CategoryModule {}
