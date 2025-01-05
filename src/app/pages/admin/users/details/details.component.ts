import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { InvestorService } from 'src/app/core/services/investor.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { findIndex } from 'lodash';
import {UsersService} from "../../../../core/services/users.service";

@Component({
  selector: 'app-investor-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  closeResult = '';
  userId: string;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  userDetails: any;


  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private service: UsersService,
    private sweetAlert: SweetAlertService
  ) {
    this.userId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findUserById(this.userId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.userDetails = data;

      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
