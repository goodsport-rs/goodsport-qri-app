import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {

  @Input() fromParent: any;
  viewData: any;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  constructor( public activeModal: NgbActiveModal, 
    private sweetAlert: SweetAlertService,
    private projService: ProjectService
  ) { 
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
      this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    if (this.fromParent && this.fromParent.reportId && this.fromParent.projectId) {
      this.dataLoadingSubject.next(true);
      this.projService.getProjectReport(this.fromParent).subscribe((val) => {
        this.viewData = val;
        this.dataLoadingSubject.next(false);
      }, (err) => {
        this.dataLoadingSubject.next(false);
        this.activeModal.close(true);
        this.sweetAlert.errorMessage('No Data found');
      })
    }
  }

  close() {
    this.activeModal.close(true);
  }
}
