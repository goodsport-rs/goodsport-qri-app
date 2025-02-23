import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ReportsService} from "../../../core/services/reports.service";


@Component({
  selector: 'app-investors',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  reports: any = [];
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
    private reportService: ReportsService,
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

  }

  getAllPartners() {
    this.reports = [];
    this.dataLoadingSubject.next(true);
    const sub = this.reportService.findAll(this.search, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.reports = data.content;
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
}
