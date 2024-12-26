import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetsModule } from '../../../_metronic/partials';
import { EntrepreneursComponent } from './entrepreneurs.component';
import { EntrepreneurDetailsComponent } from './details/details.component';


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
    WidgetsModule,
    FormsModule,
    NgbModule,
  ],
})
export class EntrepreneursModule {}
