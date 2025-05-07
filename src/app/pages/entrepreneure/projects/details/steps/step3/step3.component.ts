import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators'
import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Addreport1Component} from '../../../addreport/addreport1/addreport1.component';
import {ReportmodalComponent} from '../../../addreport/reportmodal/reportmodal.component';
import {SharemodalComponent} from '../../../addreport/sharemodal/sharemodal.component';
import {ViewReportComponent} from '../../../addreport/view-report/view-report.component';
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-signup-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @Input() projectId: string;
  @Input() projectDetails: any;

  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  activityReports: any = [];
  show: boolean;
  shareLink: string;
  copied: boolean = false;
  totalItems = 0;
  page = 1;
  dateFromFld: any;
  dateToFld: any;
  private dateToFormatted: string = '';
  private dateFromFormatted: string = '';
  locality: string = '';
  val: any;
  uploadLoading$: Observable<boolean>;
  private uploadLoadingSubject: any;
  fileName: string;
  projectFiles: any;
  reportUUID: string;

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    this.projectId = this.route.snapshot.params.id;
    this.service.setProjectId(this.projectId);
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
    this.show = true;
  }

  ngOnInit() {
    this.getActivityReports();
    this.shareReportLink();
    this.getReportFiles();
  }

  onPageChange() {

    if (this.dateToFormatted === undefined
      || this.dateFromFormatted === ''
      || this.dateFromFormatted == undefined) {
      console.log("onPageChange is empty");
      this.getActivityReports();
    } else
      console.log("onPageChange date not empty ");
      this.reportDateSearch();

  }

  getActivityReports() {
    const sub = this.service
      .findProjectReportsById(this.projectId, this.page, 10)
      .subscribe(
        (data: any) => {
          this.activityReports = data.content;
          this.totalItems = data.totalElements;
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

  shareReportLink() {
    this.service.getReportLink(this.projectId).subscribe((res: any) => {
      this.reportUUID = res.uuid;
      this.shareLink = `${window.location.origin}/reports/${res.uuid}`;
      //    this.sweetAlert.successMessage('Shared link');
    }, err => this.sweetAlert.errorMessage('Failed to share'));
  }

  shareModal() {
    const modalRef = this.modalService.open(SharemodalComponent, {size: 'lg'});
    modalRef.result.then((data) => {
      // on close
    }, (reason) => {
      // on dismiss

    });
  }


  confirmCreateFinalReport() {

    let myVar = 30;

    Swal.fire({
      title: 'Är du säker på att du vill göra en slutredovisning av projektet ?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Jag vill redovisa projektet`,
      denyButtonText: `Nej jag vill inte redovisa projektet just nu.`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.createFinalReport();
      } else if (result.isDenied) {
        Swal.fire('Du kan fortsätta jobba med rapporten har inte skickats in. ', '', 'info')

      }
    });
    console.log(myVar);

  }

  createFinalReport() {
    this.service.completeReport(this.projectId).subscribe((val) => {
      this.sweetAlert.successMessage('Redovisning klar.');
    }, (err) =>
      this.sweetAlert.errorMessage('Misslyckades skapa rapport kontakta supporten.'));
  }

  linkCopied() {
    this.copied = true;
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
          'Rapporten har laddats upp'
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
    this.dataLoadingSubject.next(true);
    this.service.getProjectReport(obj).subscribe((val: any) => {
      obj.data = val;
      this.service.approveProjectReport(val, obj.projectId, obj.reportId).subscribe((val) => {
        this.sweetAlert.successMessage('Rapporten har godkänts!');
        this.getActivityReports();
        this.dataLoadingSubject.next(false);
      }, err => {
        this.sweetAlert.errorMessage(err);
        this.dataLoadingSubject.next(false);
      })
    });
  }

  deny(id: any) {
    const obj = {projectId: this.projectId, reportId: id, status: 'edit', data: null};
    this.service.getProjectReport(obj).subscribe((val: any) => {
      obj.data = val;
      this.service.denyProjectReport(val, obj.projectId, obj.reportId).subscribe((val) => {
        this.sweetAlert.successMessage('Rapporten har avvisats');
        this.getActivityReports();
      }, err => {
        this.sweetAlert.errorMessage(err);
        this.dataLoadingSubject.next(false);
      })
    });
  }



  openModal() {

    const modalRef = this.modalService.open(ReportmodalComponent, {size: 'lg'});
    modalRef.componentInstance.reportId = this.reportUUID;
    modalRef.result.then((data) => {
      // on close
      this.service.setContinueTo('');
      this.sweetAlert.successMessage(
        'Report added successfully!'
      );
      this.getActivityReports();
    }, (reason) => {
      // on dismiss
      this.service.setContinueTo('');
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  reportDateExport() {
    console.log("Export data");
    if (this.dateToFld === undefined || this.dateFromFld == undefined) {
      this.sweetAlert.errorMessage('Start och slutdatum krävs!');
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
            this.dataLoadingSubject.next(false);
            a.remove();
          },
          (error) => {
            this.dataLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      this.unsubscribe.push(sub);
    }
  }


  reportDateSearch() {
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

  onUploadFile(event: any) {
    console.log("uploadFile file with length = " + event.target.files.length);
    if (event && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.fileName = file.name;
      formData.append('type', 'reporting');
      formData.append('phase', 'REPORTING');
      this.uploadLoadingSubject.next(true);
      this.service
        .uploadProjectFiles(this.projectDetails.id, formData)
        .subscribe(
          (data: any) => {
            this.uploadLoadingSubject.next(false);
            this.sweetAlert.successMessage("File uploaded " + file.name);
            this.fileName = '';
            this.getReportFiles();
          },
          (error) => {
            this.uploadLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      event.target.value = null;
    }
  }

  viewFileClick(projectFile: any) {
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
