import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
import { ReportsService } from "../../../core/services/reports.service";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { SweetAlertService } from "../../../core/services/alert.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-project-questionnaires',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    NgbPagination,
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './project-questionnaires.component.html',
  styleUrl: './project-questionnaires.component.scss'
})
export class ProjectQuestionnairesComponent {

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

  phases: string[] = ['FUNDING', 'PLAN', 'FINAL_REPORT'];
  selectedPhase: string = 'FINAL_REPORT';

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
    console.log(this.selectedPhase);
    this.dataLoadingSubject.next(true);
    const sub = this.reportService.getAllProjectPhaseWithQuestionnaries(this.selectedPhase).subscribe(
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

  onPhaseChange() {
    this.getAllPartners();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
