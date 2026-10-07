import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from 'src/app/core/services/project.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ViewgriComponent} from '../viewgri/viewgri.component';
import {ReportPdfService} from 'src/app/core/services/report-pdf.service';

@Component({
  selector: 'app-admingrireport',
  templateUrl: './admingrireport.component.html',
  styleUrls: ['./admingrireport.component.scss']
})
export class AdmingrireportComponent implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  dataLoading$: Observable<boolean>;
  exportLoading$: Observable<boolean>;
  exportLoadingSubject: BehaviorSubject<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  @ViewChild('content') content: ElementRef;
  viewData: any;
  page = 1;
  projectId: any;
  pageSize = 4;
  reports: any
  activeIds: any = [];
  questionnaireName : string = '';

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  private unsubscribe: Subscription[] = [];
  private questionnaireId: any;
  private questionnaireStatus: any;

  constructor(private projService: ProjectService,
              private modalService: NgbModal,
              private sweetAlert: SweetAlertService,
              private route: ActivatedRoute,
              private reportPdf: ReportPdfService) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.projectId = this.route.snapshot.params.id;
    this.exportLoadingSubject = new BehaviorSubject<boolean>(false);
    this.exportLoading$ = this.exportLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getList();
  }

  save() {
    this.dataLoadingSubject.next(true);
    let payload = {projectId: 0, groups: this.reports}
    this.projService
      .doSaveReport(this.projectId, payload)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.getList();
          this.sweetAlert.successMessage('Report saved successfully!');
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
          this.dataLoadingSubject.next(false);
        }
      );
  }

  getList() {
    this.dataLoadingSubject.next(true);
    this.projService.getFinalReportList(this.projectId).subscribe((data: any) => {
      this.viewData = data;
      this.questionnaireId = data.id;
      this.questionnaireName = data.questionnaireName;
      this.questionnaireStatus = data.status;
      if (data && data.groups && data.groups.length) {
        this.reports = data ? data['groups'] : undefined;
        data.groups.forEach((v: any, i: number) => {
          this.activeIds.push(`acc-${i}`);
        })
        this.dataLoadingSubject.next(false);
      }
    }, (err) => {
      this.dataLoadingSubject.next(false);
      // this.sweetAlert.errorMessage('Failed to load');
    })
  }


  openView(obj: any) {
    const modalRef = this.modalService.open(ViewgriComponent, {size: 'md'});
    modalRef.componentInstance.fromParent = obj;
    modalRef.result.then((data) => {
      // on close
    }, (reason) => {
      // on dismiss

    });
  }


  async print() {
    this.exportLoadingSubject.next(true);
    try {
      await this.reportPdf.downloadFinalReport({
        ...this.viewData,
        projectTitle: this.viewData?.projectTitle ?? this.projectDetails?.title,
        groups: this.reports,
      });
    } catch (error) {
      this.sweetAlert.errorMessage('PDF-filen kunde inte skapas. Försök igen eller kontakta supporten.');
    } finally {
      this.exportLoadingSubject.next(false);
    }
  }

  resetFinalReport() {
    const sub = this.projService
      .resetReport(this.projectId)
      .subscribe(
        (data: any) => {
          this.sweetAlert.successMessage(
            'Rapporten har återställts.'
          );
          this.getList();
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
