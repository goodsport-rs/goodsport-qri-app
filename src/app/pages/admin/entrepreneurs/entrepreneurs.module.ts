import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntrepreneursComponent } from './entrepreneurs.component';
import { EntrepreneurDetailsComponent } from './details/details.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../_metronic/shared/shared.module';

@NgModule({
  declarations: [EntrepreneursComponent, EntrepreneurDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EntrepreneursComponent,
      },
      {
        path: 'details/:id',
        component: EntrepreneurDetailsComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    SharedModule
  ],
})
export class EntrepreneursModule {}
