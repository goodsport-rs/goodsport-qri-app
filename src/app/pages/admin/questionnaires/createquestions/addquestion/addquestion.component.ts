import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addquestion',
  templateUrl: './addquestion.component.html',
  styleUrls: ['./addquestion.component.scss']
})
export class AddquestionComponent implements OnInit {
  form: FormGroup;
  @Input() fromParent: any;
  questionnaireId: string;
  questionDetails: any;
  questionOrder: number;
  groupOrder: number;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  questionnaireDetails: any;
  isEdit: boolean;
  questionId: any;

  constructor(private formBuilder: FormBuilder,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
    private service: QuestionnairesService, public activeModal: NgbActiveModal) { 
      this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    }

  ngOnInit(): void {
    this.questionnaireId = this.fromParent ? this.fromParent.id : null;
    this.groupOrder = this.fromParent ? this.fromParent.groupIndex : null;
    this.questionOrder = this.fromParent ? this.fromParent.questionIndex : null;
    this.buildForm();
    if (this.fromParent.editData) {
      this.patchForm(this.fromParent.editData);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      question: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      kpi: [{ value: '', disabled: false }],
      required: ['', Validators.required],
      disabled: ['', Validators.required],
      groupName: ['']
    })
    this.form.patchValue({groupName:  this.fromParent? this.fromParent.grpName : null })
  }

  patchForm(data: any) {
    this.questionId = data.id;
    this.form.patchValue({
      question: data.question,
      description: data.description,
      type: data.answerType,
      kpi: data.kpi,
      required: data.required,
      disabled: data.disabled,
      groupName: data.groupName
    });
    this.isEdit = true;
  }

  save() {
    this.onClickAdd();
  }

  onClickAdd() {
    const { value, valid } = this.form;
    if (value && valid && this.questionnaireId) {
      this.btnLoadingSubject.next(true);
      this.questionDetails = value;
      console.log(this.groupOrder);
      console.log(this.questionOrder);  
      this.questionDetails.groupOrder=this.groupOrder;
      this.questionDetails.questionOrder=this.questionOrder;
      const sub = this.service
        .createQuestions(this.questionnaireId, this.questionDetails)
        .subscribe(
          (data: any) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage('Question added successfully!');
            this.questionnaireDetails = data;
            this.form.reset();
            this.activeModal.close(data);
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

  update() {
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
            this.activeModal.close(data);
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

}
