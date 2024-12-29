import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { findIndex, remove } from 'lodash';

import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  templateUrl: './settings.component.html',
})
export class QuestionnaireSettingsComponent implements OnInit {
  allQuestionnaires: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  projectPhases: any = [];
  isEdit = false;
  details: any;
  form: FormGroup;

  constructor(
    private service: QuestionnairesService,
    private sweetAlert: SweetAlertService,
    private projectService: ProjectService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getAllQuestionnaires();
    this.getProjectPhases();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      questionnaireId: ['', Validators.required],
      projectPhase: ['', Validators.required],
    });
  }

  getAllQuestionnaires() {
    this.allQuestionnaires = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service.getQuestionnaireConfig().subscribe(
      (data) => {
        this.dataLoadingSubject.next(false);
        this.allQuestionnaires = data;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectPhases() {
    const sub = this.projectService.findProjectPhases().subscribe(
      (data: any) => {
        this.projectPhases = data;
      },
      (error) => {
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  openModal(content: any, data: any) {
    this.details = data;
    this.form.reset();
    this.form.patchValue({
      questionnaireId: data.questionnaireId,
      projectPhase: data.projectPhase,
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      // size: 'lg',
      centered: true,
    });
  }

  onClickUpdate(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const sub = this.service.updateQuestionnaireConfig(value).subscribe(
        (data: any) => {
          this.btnLoadingSubject.next(false);
          const index = findIndex(this.allQuestionnaires, {
            id: this.details.id,
          });
          if (index > -1) {
            this.allQuestionnaires[index] = data;
          }
          this.sweetAlert.successMessage('Phase updated successfully!');
          this.details = null;
          this.form.reset();
          modal.close('');
        },
        (error) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    }
  }
}
