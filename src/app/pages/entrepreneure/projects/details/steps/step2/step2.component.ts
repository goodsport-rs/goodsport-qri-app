import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {BehaviorSubject, Subscription, Observable} from 'rxjs';

import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {findIndex} from 'lodash';

@Component({
  selector: 'app-signup-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
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
  isUpdated = false;
  missingRequiredAnswer = false;
  questionnaireName: any;

  constructor(
    private projectService: ProjectService,
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
    this.getFundingQuestionnaire();
  }

  getFundingQuestionnaire() {
    this.dataLoadingSubject.next(true);
    const sub = this.projectService
      .findProjectPhaseQuestionnaires(this.projectDetails.id, 'FUNDING')
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.questionnaireName = data.name;
          this.answers = data;
          data.questionAnswers.forEach((val: any) => {
            if (val.answerId) {
              this.isUpdated = true;
            }
            this.allAnswers.push({
              question: val.question,
              description: val.description,
              answerType: val.answerType,
              questionId: val.questionId,
              answer: val.answer || '',
              answerId: val.answerId,
              comments: val.comments,
              files: val.files || [],
              required: val.required,
            });
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
    const questionsList: any = [];
    this.missingRequiredAnswer = false;
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
          else {
            if (val.required) {
              this.missingRequiredAnswer = true;
            }
          }
        }
        if (this.isUpdated) {
          obj.answerId = val.answerId;
        }
        questionsList.push(obj);
      }
      else {
        if (val.required) {
          this.missingRequiredAnswer = true;
        }
      }
    });
    if (questionsList.length === 0) {
      return this.sweetAlert.errorMessage('No question is answered');
    }
    if (this.missingRequiredAnswer) {
      return this.sweetAlert.errorMessage('Required questions not answered');
    }
    this.btnLoadingSubject.next(true);
    if (this.isUpdated) {
      this.updateAnswers(questionsList);
    } else {
      this.addAnswers(questionsList);
    }
  }

  addAnswers(array: any) {
    this.projectService
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
    this.projectService
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
    this.projectService.completeProjectQuestionnaire(this.projectDetails.id).subscribe(
      (data: any) => {
        this.btnLoadingSubject.next(false);
        this.projectDetails = data;
        this.isUpdated = true;
        this.updateParent.next(data);
      },
      (error) => this.btnLoadingSubject.next(false)
    );
  }

  onUploadFile(event: any, questionId: number) {
    if (event && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('phase', 'FUNDING');
      formData.append('type', 'DOCUMENT');
      this.uploadLoadingSubject.next(true);
      this.projectService
        .uploadProjectFiles(this.projectDetails.id, formData)
        .subscribe(
          (data: any) => {
            this.uploadLoadingSubject.next(false);
            const index = findIndex(this.questionFiles, {questionId});
            const newIndex = findIndex(this.allAnswers, {questionId});
            if (index === -1) {
              this.questionFiles.push({
                questionId,
                projectFileIds: [data.fileId],
              });
            } else {
              this.questionFiles[index].projectFileIds.push(data.fileId);
            }
            if (newIndex > -1) {
              this.allAnswers[newIndex].files.push({
                fileId: data.fileId,
                fileName: data.name,
              });
            }
          },
          (error) => {
            this.uploadLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
    }
  }

  onClickFile(file: any) {
    this.projectService
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
