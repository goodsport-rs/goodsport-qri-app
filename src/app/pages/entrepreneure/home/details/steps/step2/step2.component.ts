import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { findIndex } from 'lodash';

@Component({
  selector: 'app-signup-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  answers: any;
  allAnswers: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  uploadLoading$: Observable<boolean>;
  uploadLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  questionFiles: any = [];

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getPlanQuestions();
  }

  getPlanQuestions() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findProjectPhaseQuestionnaires(this.projectDetails.id, 'FUNDING')
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.answers = data;
          data.questionAnswers.forEach((val: any) => {
            // if (val.answerType !== 'FILE') {
            this.allAnswers.push({
              question: val.question,
              answerType: val.answerType,
              questionId: val.questionId,
              answer: val.answer || '',
              answerId: val.answerId,
              comments: val.comments,
              files: val.files || [],
            });
            // }
          });
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onClickSubmitAnswer() {
    const array: any = [];
    this.allAnswers.forEach((val: any) => {
      if (val.answer || val.answerType === 'FILE') {
        const obj: any = {
          questionId: val.questionId,
          answer: val.answer || 'FILE',
        };
        if (val.answerType === 'FILE') {
          const index = findIndex(this.questionFiles, {
            questionId: val.questionId,
          });
          if (index > -1) {
            obj.projectFileIds = this.questionFiles[index].projectFileIds;
          }
        }
        if (
          this.projectDetails.projectPhase === 'PLAN' &&
          this.projectDetails.projectStatus === 'PENDING'
        ) {
          obj.answerId = val.answerId;
        }
        array.push(obj);
      }
    });
    if (array.length === 0) {
      return this.sweetAlert.errorMessage('No question is answered');
    }
    this.btnLoadingSubject.next(true);
    if (
      this.projectDetails.projectPhase === 'FUNDING' &&
      this.projectDetails.projectStatus === 'PENDING'
    ) {
      this.updateAnswers(array);
    } else {
      this.addAnswers(array);
    }
  }

  addAnswers(array: any) {
    this.service
      .answerProjectQuestions(this.projectDetails.id, this.answers.id, {
        answers: array,
      })
      .subscribe(
        (data: any) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.successMessage('Answers submitted successfully!');
          this.markQuestionnaireCompleted();
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
          this.btnLoadingSubject.next(false);
        }
      );
  }

  updateAnswers(array: any) {
    this.service
      .editProjectAnswers(this.projectDetails.id, this.answers.id, {
        answers: array,
      })
      .subscribe(
        (data: any) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.successMessage('Answers updated successfully!');
          this.markQuestionnaireCompleted();
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
          this.btnLoadingSubject.next(false);
        }
      );
  }

  markQuestionnaireCompleted() {
    this.service.completeProjectQuestionnaire(this.projectDetails.id).subscribe(
      (data: any) => this.btnLoadingSubject.next(false),
      (error) => this.btnLoadingSubject.next(false)
    );
  }

  onUploadFile(event: any, questionId: number) {
    if (event && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('type', 'idea');
      this.uploadLoadingSubject.next(true);
      this.service
        .uploadProjectFiles(this.projectDetails.id, formData)
        .subscribe(
          (data: any) => {
            this.uploadLoadingSubject.next(false);
            const index = findIndex(this.questionFiles, { questionId });
            if (index === -1) {
              this.questionFiles.push({
                questionId,
                projectFileIds: [data.fileId],
              });
            } else {
              this.questionFiles[index].projectFileIds.push(data.fileId);
            }
          },
          (error) => {
            console.log('this is err==========', error);
            this.uploadLoadingSubject.next(false);
          }
        );
    }
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
