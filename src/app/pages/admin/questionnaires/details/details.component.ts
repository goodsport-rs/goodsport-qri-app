import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'selector-name',
  templateUrl: './details.component.html',
})
export class QuestionnaireDetailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  questionnaireId: string;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  deleteLoading$: Observable<boolean>;
  deleteLoadingSubject: BehaviorSubject<boolean>;
  publishLoading$: Observable<boolean>;
  publishLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  questionnaireDetails: any;
  isEdit = false;
  questionId: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: QuestionnairesService,
    private sweetAlert: SweetAlertService,
    private modalService: NgbModal
  ) {
    this.questionnaireId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.deleteLoadingSubject = new BehaviorSubject<boolean>(false);
    this.deleteLoading$ = this.deleteLoadingSubject.asObservable();
    this.publishLoadingSubject = new BehaviorSubject<boolean>(false);
    this.publishLoading$ = this.publishLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.initForm();
    this.getQuestionnaire();
  }

  initForm() {
    this.form = this.fb.group({
      question: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      kpi: [{ value: '', disabled: false }],
      required: ['', Validators.required],
    });
  }

  getQuestionnaire() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findOneQuestionnaire(this.questionnaireId)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.questionnaireDetails = data;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onClickButton() {
    if (!this.isEdit) {
      return this.onClickAdd();
    }
    this.onClickUpdate();
  }

  onClickAdd() {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const sub = this.service
        .createQuestions(this.questionnaireId, value)
        .subscribe(
          (data: any) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage('Question added successfully!');
            this.questionnaireDetails = data;
            this.form.reset();
          },
          (error) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  onClickEditIcon(data: any) {
    this.questionId = data.id;
    this.form.patchValue({
      question: data.question,
      description: data.description,
      type: data.answerType,
      kpi: data.kpi,
      required: data.required,
    });
    this.isEdit = true;
  }

  onClickCancel() {
    this.form.reset();
    this.isEdit = false;
  }

  onClickUpdate() {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const sub = this.service
        .updateQuestion(this.questionnaireId, this.questionId, value)
        .subscribe(
          (data: any) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage('Question updated successfully!');
            this.questionnaireDetails = data;
            this.form.reset();
            this.isEdit = false;
            this.questionId = null;
          },
          (error) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  onClickDeleteIcon(content: any, id: string) {
    this.questionId = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    this.deleteLoadingSubject.next(true);
    const sub = this.service
      .removeQuestion(this.questionnaireId, this.questionId)
      .subscribe(
        (data: any) => {
          this.deleteLoadingSubject.next(false);
          this.sweetAlert.successMessage('Question deleted successfully!');
          this.questionnaireDetails = data;
          this.questionId = null;
          modal.close('');
        },
        (error) => {
          this.deleteLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onClickPublish() {
    this.publishLoadingSubject.next(true);
    const sub = this.service
      .publishQuestionnaire(this.questionnaireId)
      .subscribe(
        (data: any) => {
          this.publishLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Questionnaire published successfully!'
          );
          this.questionnaireDetails = data;
        },
        (error) => {
          this.publishLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
