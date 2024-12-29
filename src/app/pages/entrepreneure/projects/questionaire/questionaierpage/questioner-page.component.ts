import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription, Observable} from 'rxjs';
import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';
import * as lodash from 'lodash';
import {findIndex} from 'lodash';
import Swal from "sweetalert2";

@Component({
  selector: 'app-questionaierpage',
  templateUrl: './questioner-page.component.html',
  styleUrls: ['./questioner-page.component.scss']
})
export class QuestionerPageComponent implements OnInit {
  projectDetails: any;
  projectId: string;
  objectKeys = Object.keys;
  formItems: FormArray;
  dataLoading$: Observable<boolean>;

  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  uploadLoading$: Observable<boolean>;
  uploadLoadingSubject: BehaviorSubject<boolean>;
  questionFiles: any = [];
  allAnswers: any = [];
  isUpdated = false;
  questionnaireStatus: any;
  questionnaireId: any;
  questionnaireName: any;

  finalReportQuestionnaire: any;
  groupQuestions: any = [];
  answers: any;

  constructor(private projectService: ProjectService,
              private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sweetAlert: SweetAlertService) {
    this.projectId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
  }

  ngOnInit(): void {

    this.getProjectDetails();
  }


  getProjectDetails() {
    this.dataLoadingSubject.next(true);
    const sub = this.projectService.findProjectById(this.projectId).subscribe(
      (data: any) => {
        // this.dataLoadingSubject.next(false);
        this.projectDetails = data;
        console.log(data);
        this.getQuestions();
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getQuestions() {
    this.allAnswers = [];
    this.dataLoadingSubject.next(true);
    const sub = this.projectService.findProjectPhaseQuestionnaires(this.projectId, 'FINAL_REPORT').subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.finalReportQuestionnaire = data;
        //   this.allAnswers = data.questionAnswers;
        this.questionnaireStatus = data.status;
        this.questionnaireId = data.id;
        this.questionnaireName = data.name;

        data.questionAnswers.forEach((val: any) => {
          if (val.answerId) {
            this.isUpdated = true;
          }
          // if (val.answerType !== 'FILE') {
          this.allAnswers.push({
            question: val.question,
            groupName: val.groupName,
            description: val.description,
            answerType: val.answerType,
            questionId: val.questionId,
            answer: val.answer || '',
            answerId: val.answerId,
            comments: val.comments,
            required: val.required,
            files: val.files || [],
          });
          // }
        });


        this.groupQuestions = lodash.groupBy(this.allAnswers, ele => ele.groupName);
        console.log(this.groupQuestions);
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }


  createAnswersPayload() {
    let questionsList: any = [];
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
        if (this.isUpdated) {
          obj.answerId = val.answerId;
        }
        console.log(obj);
        questionsList.push(obj);
      }
    });
    if (questionsList.length === 0) {
      return this.sweetAlert.errorMessage('No question is answered');
    }
    return questionsList;
  }

  saveFinalReport() {
    let answersPayload = this.createAnswersPayload();
    console.log("question files");
    console.log(answersPayload);

    //   let qt = this.allAnswers;
    let ans: any[] = [];
    answersPayload.forEach((val: any) => {
      let obj = {
        questionId: val.questionId,
        answer: val.answer,
        answerId: val.answerId,
        projectFileIds: val.projectFileIds
      }

      if (val.answerType === 'FILE' && val.projectFileIds.length > 0) {
        ans.push(obj);
      }

      if (val.answerType != 'FILE' && val.answer != '' || val.answer != undefined) {
        ans.push(obj);
      }
    });

    let filteredPayload = lodash.filter(ans, value => value.answer != '');

    let payload = {
      'answers': answersPayload
    }
    this.dataLoadingSubject.next(true);
    this.projectService.answerProjectQuestions(this.projectId, this.questionnaireId, payload).subscribe((res) => {
        this.getQuestions();
        this.sweetAlert.successMessage('Successfully submitted answers!');
        this.dataLoadingSubject.next(false);
      },
      (err) => {
        this.sweetAlert.errorMessage(err);
        this.dataLoadingSubject.next(false);
      });
  }

  sendFinalReportForReview() {

    let answers: any[] = [];
    let missingAnswers: any[] = [];
    this.allAnswers.forEach((val: any) => {

      if (val.answerType === 'FILE') {
        const index = findIndex(this.questionFiles, {questionId: val.questionId,});
        if (index > -1) {
          val.projectFileIds = this.questionFiles[index].projectFileIds;
        }
        const formAnswerFileItem: any = {
          questionId: val.questionId,
          answer: 'FILE',
        };

        if (this.isUpdated) {
          formAnswerFileItem.answerId = val.answerId;
        }

        answers.push(formAnswerFileItem);
      } else {
        let formAnswerItem = {
          questionId: val.questionId,
          answer: val.answer,
          answerId: val.answerId,
          projectFileIds: val.projectFileIds
        }
        if (val.required && val.answer == '') {
          let missingAnswerItem = {
            questionId: val.questionId,
            question: val.question,
            answer: val.answer,
            answerId: val.answerId,
            projectFileIds: val.projectFileIds
          }
          missingAnswers.push(missingAnswerItem);
        }
        answers.push(formAnswerItem);
      }
    });


    let filteredPayload = lodash.filter(answers, value => value.answer != '')
    console.log(filteredPayload);
    let payload = {
      'answers': filteredPayload
    }

    if (missingAnswers.length == 0) {
      this.projectService.answerProjectQuestions(this.projectId, this.questionnaireId, payload).subscribe((res) => {

          this.projectService.answerQuestionnaire(this.projectId, payload).subscribe((res) => {
              this.sweetAlert.successMessage('Successfully submitted answers!');
              this.getQuestions();
            },
            (err) => {
              this.sweetAlert.errorMessage(err);
            })
        },
        (err) => {
          this.sweetAlert.errorMessage(err);
        });
    } else {
      console.log(missingAnswers);
      this.sweetAlert.errorMessage('Ofullständing rapport antal frågor som ej besvarats  ' + missingAnswers.length);
    }
  }


  onUploadFile(event: any, questionId: number) {
    if (event && event.target.files.length > 0) {
      console.log("Uploading file for question " + questionId);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('type', 'DOCUMENT');
      formData.append('phase', 'FINAL_REPORT');

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
            this.groupQuestions = lodash.groupBy(this.allAnswers, ele => ele.groupName);
            this.sweetAlert.successMessage("File uploaded " + file.name);
          },
          (error) => {
            this.uploadLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      event.target.value = null;
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

  confirmSendReport() {

    let myVar = 30;

    Swal.fire({
      title: 'Är du säker på att du skicka in GRI rapporten ?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Skicka in rapporten`,
      denyButtonText: `Skicka inte rapporten`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.sendFinalReportForReview();
      } else if (result.isDenied) {
        Swal.fire('Du kan fortsätta jobba med rapporten har inte skickats in. ', '', 'info')

      }
    });
    console.log(myVar);

  }
}
