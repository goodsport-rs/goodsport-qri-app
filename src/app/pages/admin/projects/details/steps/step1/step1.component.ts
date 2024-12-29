import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { findIndex } from 'lodash';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-signup-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
  allAnswers: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  comments: string = '';
  answerId: any;
  spaceRegex = /^$|.*\S+.*/;

  questionnaireId: string = '';
  questionnaireName: string = '';
  questionnaireStatus: string = '';

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
    this.getPlanQuestions();
  }

  getPlanQuestions() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findProjectPhaseQuestionnaires(this.projectDetails.id, 'PLAN')
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allAnswers = data.questionAnswers;
          this.questionnaireId = data.id;
          this.questionnaireName = data.name;
          this.questionnaireStatus = data.status;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  openModal(content: any, id: number) {
    this.answerId = id;
    this.comments = '';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    this.statusLoadingSubject.next(true);
    this.service
      .answerComments(this.answerId, { comment: this.comments })
      .subscribe(
        (data: any) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage('Internal notes added successfully!');
          modal.close('');
          const index = findIndex(this.allAnswers, { answerId: this.answerId });
          if (index > -1) {
            if (this.allAnswers[index].comments) {
              this.allAnswers[index].comments.push({ comment: this.comments });
            } else {
              this.allAnswers[index].comments = [{ comment: this.comments }];
            }
          }
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

  onClickFile(file: any) {
    this.service
      .downloadProjectFile(this.projectDetails.id, file.fileId)
      .subscribe(
        (data: any) => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = file.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
        }
      );
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
          this.sweetAlert.successMessage('Project PLAN approved successfully!');
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
    if (!this.spaceRegex.test(this.comments)) {
      return this.sweetAlert.errorMessage('Only white spaces are not allowed');
    }
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .reworkProject(this.projectDetails.id, { comment: this.comments })
      .subscribe(
        (data: any) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project status updated successfully!'
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
}
