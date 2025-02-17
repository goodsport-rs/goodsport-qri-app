import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersComponent } from './users.component';
import { UserDetailsComponent } from './details/details.component';
import {SharedModule} from "../../../_metronic/shared/shared.module";

@NgModule({
  declarations: [UsersComponent, UserDetailsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: UsersComponent,
            },
            {
                path: 'details/:id',
                component: UserDetailsComponent,
            },
        ]),
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
    ],
})
export class UsersModule {}
