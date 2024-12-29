import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { findIndex } from 'lodash';


import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'questionnaire-text1',
  templateUrl: './questionnaire-text1.component.html',
})
export class QuestionnaireText1Component implements OnInit {
  @Input() QuestionInfo: any;
  @Input() projectDetails: any;
  allAnswers: any = [];
  comment: string = '';
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  uploadLoading$: Observable<boolean>;
  uploadLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
  ) {
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
  }

  ngOnInit(): void {}

  onClickSubmit() {
    this.btnLoadingSubject.next(true);
    this.service
      .answerComments(this.QuestionInfo.answerId, { comment: this.comment })
      .subscribe(
        (data: any) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.successMessage('Internal notes added successfully!');
            if (this.QuestionInfo.comments) {
              this.QuestionInfo.comments.push({ comment: this.comment, createdDateTime: Date.now() });
            } else {
              this.QuestionInfo.comments = [{ comment: this.comment, createdDateTime: Date.now() }];
            }
            this.comment = '';
        },
        (error) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

  onUploadFile(event: any, questionId: number) {
  }

  onClickFile(file: any) {
    console.log("fetechin project id "+this.projectDetails.id);
    this.service
      .downloadProjectFile(this.projectDetails?.id, file.fileId)
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


}
