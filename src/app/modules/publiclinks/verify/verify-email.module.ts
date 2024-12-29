import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineSVGModule} from 'ng-inline-svg';
import {VerifyEmailComponent} from "./verify-email.component";


@NgModule({
  declarations: [
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: VerifyEmailComponent,
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class VerifyEmailModule {}
