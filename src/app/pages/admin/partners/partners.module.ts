import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { PartnersComponent } from './partners.component';


@NgModule({
  declarations: [PartnersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PartnersComponent,
      },
    ]),
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    ReactiveFormsModule,
  ],
})
export class PartnersModule {}
