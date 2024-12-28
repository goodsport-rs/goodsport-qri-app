import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { InvestorService } from 'src/app/core/services/investor.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import {PartnersService} from "../../../core/services/partners.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-investors',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit, OnDestroy {
  allPartners: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;

  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;
  totalPages = 0;
  form: FormGroup;

  constructor(
    private partnersService: PartnersService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllPartners();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      partnerName: ['', Validators.required],
      partnerCode: ['', Validators.required]

    });
  }

  getAllPartners() {
    this.allPartners = [];
    this.dataLoadingSubject.next(true);
    const sub = this.partnersService.findAll(this.search, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allPartners = data.content;
        this.totalItems = data.totalElements;
        this.totalPages = data.totalPages;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllPartners();
  }

  onPageChange() {
    this.getAllPartners();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }



  onClickSave(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const { partnerName, partnerCode } = value;
      const sub = this.partnersService
        .save({ partnerName, partnerCode })
        .subscribe(
          (data: any) => {
            this.allPartners.unshift(data);
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage(
              'Admin added!'
            );
            modal.close('');
            this.form.reset();
          },
          (error) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(
              'Process could not be completed. Make sure you have entered the valid input.'
            );
          }
        );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }

  }

  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
    });
  }
}
