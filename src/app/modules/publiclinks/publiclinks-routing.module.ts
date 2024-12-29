import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkreportComponent } from './reports/linkreport/linkreport.component';

const routes: Routes = [
 {
     path: '',
     component: LinkreportComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicLinksRoutingModule {}
