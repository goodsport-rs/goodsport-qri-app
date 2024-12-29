import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {QuestionnairesService} from 'src/app/core/services/questionnaires.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from 'src/app/core/services/project.service';
import {PartnersService} from "../../../core/services/partners.service";

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss'],
})
export class QuestionnairesComponent implements OnInit, OnDestroy {
  allQuestionnaires: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  closeResult = '';
  form: FormGroup;
  projectPhases: any = [];
  partners: any = [];
  page = 1;
  totalPages = 0;
  search = '';

  constructor(
    private modalService: NgbModal,
    private service: QuestionnairesService,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private partnerService: PartnersService,
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllQuestionnaires();
    this.initForm();
    this.getProjectPhases();
    this.getPartnersList();
  }

  getAllQuestionnaires() {
    this.allQuestionnaires = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findAllQuestionnaires(this.search, this.page, 10)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allQuestionnaires = data.content;
          this.totalPages = data.totalElements;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllQuestionnaires();
  }

  onPageChange() {
    this.getAllQuestionnaires();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      audienceType: ['', Validators.required],
      ownerId: ['', Validators.required],
      projectPhase: [''],
    });
  }

  getPartnersList() {
    const sub = this.partnerService.list().subscribe(
      (data: any) => {
        this.partners = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectPhases() {
    const sub = this.projectService.findProjectPhases().subscribe(
      (data: any) => {
        this.projectPhases = data;
        const index = this.projectPhases.indexOf('IDEA');
        if (index > -1) {
          this.projectPhases.splice(index, 1);
        }
        const secIndex = this.projectPhases.indexOf('REPORTING');
        if (secIndex > -1) {
          this.projectPhases.splice(secIndex, 1);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
    });
  }

  onChangeAudienceType() {
    const {audienceType} = this.form.value;
    if (audienceType === 'PROJECT') {
      this.form.controls.projectPhase.setValidators([Validators.required]);
    } else {
      this.form.controls.projectPhase.setValidators([]);
    }
    this.form.controls.projectPhase.updateValueAndValidity();
  }

  onClickSave(modal: any) {
    const {value, valid} = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const {name, audienceType, projectPhase,ownerId} = value;
      const sub = this.service
        .createQuestionnaire({name, audienceType,ownerId})
        .subscribe(
          (data: any) => {
            this.allQuestionnaires.unshift(data);
            if (value.audienceType === 'PROJECT') {
              return this.bindQuestionnairePhase(
                {
                  questionnaireId: data.id,
                  projectPhase,
                },
                modal
              );
            }
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage(
              'Questionnaire created successfully!'
            );
            modal.close('');
            this.form.reset();
          },
          (error) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(
              'Process could not be completed. Make sure you have entered the valid input.'
            );
          }
        );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  bindQuestionnairePhase(value: any, modal: any) {
    const sub = this.service.addQuestionnairePhase(value).subscribe(
      (data: any) => {
        this.btnLoadingSubject.next(false);
        this.sweetAlert.successMessage('Questionnaire created successfully!');
        modal.close('');
        this.form.reset();
      },
      (error) => {
        this.btnLoadingSubject.next(false);
        this.sweetAlert.errorMessage(
          'Process could not be completed. Make sure you have entered the valid input.'
        );
      }
    );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
