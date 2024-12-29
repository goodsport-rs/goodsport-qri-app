import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LinkreportComponent } from './reports/linkreport/linkreport.component';
import { PublicLinksRoutingModule } from './publiclinks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClipboardModule } from 'ngx-clipboard';
import { WidgetsModule } from 'src/app/_metronic/partials';



@NgModule({
  declarations: [
    LinkreportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    ClipboardModule,
    NgApexchartsModule,
    NgbModule,
    PublicLinksRoutingModule
  ],
  providers: [DatePipe,  NgbActiveModal],
})
export class PubliclinksModule { }
