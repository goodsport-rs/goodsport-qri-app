import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ActivatedRoute} from '@angular/router';
import {ViewReportComponent} from 'src/app/pages/entrepreneure/projects/addreport/view-report/view-report.component';
import {ReportmodalComponent} from 'src/app/pages/entrepreneure/projects/addreport/reportmodal/reportmodal.component';
import * as moment from "moment";

@Component({
  selector: 'app-signup-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
  projectId: string;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  comments: string = '';
  show = false;
  activityReports: any = [];
  totalItems = 0;
  page = 1;
  model: any;
  dateFromFld: NgbDateStruct;
  dateToFld: NgbDateStruct;
  private unsubscribe: Subscription[] = [];
  private dateToFormatted: string = '';
  private dateFromFormatted: string = '';
  locality: string = '';
  location: string = '';
  projectFiles: any;

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.projectId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getActivityReports();
    this.getReportFiles();
  }

  onPageChange() {
    console.log("onPageChange" + this.dateToFormatted);
    if (this.dateToFormatted === undefined || this.dateFromFormatted == undefined) {
      console.log("onPageChange is empty");
      this.getActivityReports();
    } else
      this.reportDateSearch();
  }

  openView(id: any) {
    const modalRef = this.modalService.open(ViewReportComponent, {size: 'lg'});
    modalRef.componentInstance.fromParent = {projectId: this.projectId, reportId: id};
    modalRef.result.then((data) => {
      // on close
    }, (reason) => {
      // on dismiss

    });
  }

  openEdit(id: any) {
    const obj = {projectId: this.projectId, reportId: id, status: 'edit', data: null};
    this.service.getProjectReport(obj).subscribe((val: any) => {
      obj.data = val;
      const modalRef = this.modalService.open(ReportmodalComponent, {size: 'lg'});
      this.service.setEditReport(obj)
      modalRef.result.then((data) => {
        // on close
        this.service.setContinueTo('');
        this.sweetAlert.successMessage(
          'Report updated successfully!'
        );
        this.getActivityReports();
      }, (reason) => {
        // on dismiss
        this.service.setContinueTo('');
      });
    });
  }

  approve(id: any) {
    const obj = {projectId: this.projectId, reportId: id, status: 'edit', data: null};
    this.service.getProjectReport(obj).subscribe((val: any) => {
      obj.data = val;
      this.service.approveProjectReport(val, obj.projectId, obj.reportId).subscribe((val) => {
        this.sweetAlert.successMessage('Successfully approved!');
        this.getActivityReports();
      }, err => this.sweetAlert.errorMessage(err))
    });
  }

  deny(id: any) {
    const obj = {projectId: this.projectId, reportId: id, status: 'edit', data: null};
    this.service.getProjectReport(obj).subscribe((val: any) => {
      obj.data = val;
      this.service.denyProjectReport(val, obj.projectId, obj.reportId).subscribe((val) => {
        this.sweetAlert.successMessage('Successfully approved!');
        this.getActivityReports();
      }, err => this.sweetAlert.errorMessage(err))
    });
  }

  reportDateSearch() {

    if (this.dateToFld === undefined || this.dateFromFld == undefined) {
      console.log("search is empty");
      this.getActivityReports();
    } else {

      let dateTo = new Date(this.dateToFld.year, this.dateToFld.month - 1, this.dateToFld.day);
      let dateFrom = new Date(this.dateFromFld.year, this.dateFromFld.month - 1, this.dateFromFld.day);
      this.dateToFormatted = moment(dateTo).format('YYYY-MM-DD');
      this.dateFromFormatted = moment(dateFrom).format('YYYY-MM-DD');


      this.dataLoadingSubject.next(true);

      const sub = this.service
        .findProjectReportsByIdAndRange(this.projectId, this.page, 10, this.dateFromFormatted, this.dateToFormatted, this.locality)
        .subscribe(
          (data: any) => {
            console.log('getActivityReports id = ' + this.projectId + ' ' + this.dateToFld + ' ' + this.dateFromFld);
            this.dataLoadingSubject.next(false);
            this.activityReports = data.content;
            this.totalItems = data.totalElements;
            console.log(data.totalElements);
          },
          (error) => {
            this.dataLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      this.unsubscribe.push(sub);
    }

  }

  reportExport() {
    let dateTo = new Date(this.dateToFld.year, this.dateToFld.month, this.dateToFld.day);
    let dateFrom = new Date(this.dateFromFld.year, this.dateFromFld.month, this.dateFromFld.day);
    this.dateToFormatted = moment(dateTo).format('YYYY-MM-DD');
    this.dateFromFormatted = moment(dateFrom).format('YYYY-MM-DD');


    console.log('getActivityReports id = ' + this.projectId + ' ' + this.dateToFormatted + ' ' + this.dateFromFormatted);
  }

  getActivityReports() {

    this.dataLoadingSubject.next(true);

    const sub = this.service
      .findProjectReportsById(this.projectId, this.page, 10)
      .subscribe(
        (data: any) => {
          console.log('getActivityReports id = ' + this.projectId + ' ' + this.dateToFld + ' ' + this.dateFromFld);
          this.dataLoadingSubject.next(false);
          this.activityReports = data.content;
          this.totalItems = data.totalElements;
          console.log(data.totalElements);
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);

  }


  goStep4() {
    this.service.completeReport(this.projectId).subscribe((val) => {
      this.sweetAlert.successMessage('Report phase completed');
    }, (err) =>
      this.sweetAlert.errorMessage('Failed to complete'));
  }

  onClickApproveReject(content: any) {
    this.comments = '';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onClickPopupBtn(modal: any, type: string) {
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .approveRejectProject(this.projectDetails.id, type)
      .subscribe(
        (data: any) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project REPORTING approved successfully!'
          );
          modal.close('');
          this.projectDetails = data;
          this.updateParent.next(data);
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  reportDateExport() {
    console.log("Export data");
    if (this.dateToFld === undefined || this.dateFromFld == undefined) {

    } else {
      let dateTo = new Date(this.dateToFld.year, this.dateToFld.month - 1, this.dateToFld.day);
      let dateFrom = new Date(this.dateFromFld.year, this.dateFromFld.month - 1, this.dateFromFld.day);
      this.dateToFormatted = moment(dateTo).format('YYYY-MM-DD');
      this.dateFromFormatted = moment(dateFrom).format('YYYY-MM-DD');


      this.dataLoadingSubject.next(true);

      const sub = this.service
        .findProjectReportsByIdAndRangeExport(this.projectId, this.dateFromFormatted, this.dateToFormatted, this.locality)
        .subscribe(
          (data: any) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = "report_export.docx";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          },
          (error) => {
            this.sweetAlert.errorMessage(error);
          }
        );
      this.unsubscribe.push(sub);

    }

  }


  getReportFiles() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .getProjectFiles(this.projectId)
      .subscribe(
        (data: any) => {
          this.projectFiles = data;
          this.dataLoadingSubject.next(false);
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
    // this.dataLoadingSubject.next(false);
  }

  onClickViewIcon(projectFile: any) {
    const sub = this.service
      .downloadProjectFile(this.projectId, projectFile.id)
      .subscribe(
        (data: any) => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = projectFile.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }
}
