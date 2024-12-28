import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { MediaComponent } from './media.component';


@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MediaComponent,
      },

    ]),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgbPaginationModule
  ],
})
export class MediaModule {}
