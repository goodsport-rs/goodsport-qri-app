import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-signup-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
  allAnswers: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  comments: string = '';

  private unsubscribe: Subscription[] = [];
  questionnaireId: any;
  questionnaireName: string = '';
  questionnaireStatus: any;

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private modalService: NgbModal
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.statusLoadingSubject = new BehaviorSubject<boolean>(false);
    this.statusLoading$ = this.statusLoadingSubject.asObservable();
  }

  ngOnInit() {
    // this.getPlanQuestions();
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
            'Project FINAL REPORT approved successfully!'
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

  onClickRework(modal: any) {
    if (!this.comments) {
      return this.sweetAlert.errorMessage('Comment is required');
    }
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .reworkProject(this.projectDetails.id, { comment: this.comments })
      .subscribe(
        () => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project status updated successfully!'
          );
          modal.close('');
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
}
