import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {EntrepreneurService} from 'src/app/core/services/entrepreneurs.service';

import {environment} from 'src/environments/environment';
import {QuestionnairesService} from 'src/app/core/services/questionnaires.service';
import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {VerifyService} from "../../../core/services/verify.service";
import { StorageService } from 'src/app/auth/guards/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  showKyc = true;
  isUserVerified = true;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnPrefLoading$: Observable<boolean>;
  btnPrefLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  page = 1;
  totalPages = 0;
  allProjects: any = [];
  questions: any;
  allQuestions: any = [];
  form: FormGroup;
  kyc = false;
  entrepreneurId: any;
  profile: any;
  allCategories: any = [];

  constructor(
    private entrepreneurService: EntrepreneurService,
    private storage: StorageService,
    private modalService: NgbModal,
    private questionnairesService: QuestionnairesService,
    private projectService: ProjectService,
    private sweetAlert: SweetAlertService,
    private verifyService: VerifyService,
    private fb: FormBuilder
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnPrefLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnPrefLoading$ = this.btnPrefLoadingSubject.asObservable();

  }

  ngOnInit(): void {
    this.getMe();
    this.initForm();
    this.getAllCategories();

    const storageObj = this.storage.getStorage(environment.USERDATA_KEY);

  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }


  getMe() {
    this.dataLoadingSubject.next(true);
    this.entrepreneurService.findMe().subscribe(
      (data: any) => {
        this.profile = data;
        let userInfo = this.storage.getStorage(environment.USERDATA_KEY);
        if (!userInfo) {
          userInfo = { userId: data.id, kyc: data.organizationKYCDone, email: data.email }; // Set default values
        } else {
          userInfo.kyc = data.organizationKYCDone;
        }
        this.isUserVerified = data.verified;
        this.storage.setStorage(environment.USERDATA_KEY, userInfo);
        this.showKyc = userInfo.kyc;
        this.kyc = userInfo.kyc;
        this.getAllProjects();
        if (!userInfo.kyc) {
          this.getOrganizationQuestions();
        }
        this.dataLoadingSubject.next(false);
      },
      (error) => {
        console.log(error);
        this.dataLoadingSubject.next(false);
      }
    );
  }

  getOrganizationQuestions() {
    this.questionnairesService.getOrganizationQuestionnaire().subscribe(
      (data: any) => {
        this.questions = data;
        data.questions.forEach((val: any) => {
          this.allQuestions.push({
            question: val.question,
            answerType: val.answerType,
            questionId: val.id,
            answer: '',
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllProjects() {
    this.dataLoadingSubject.next(true);
    this.projectService.findAllProjects('', '', '', this.page, 10).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allProjects = data.content;
        this.totalPages = data.totalPages;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }

  onPageChange() {
    this.getAllProjects();
  }

  getAllCategories() {
    const sub = this.projectService.findAllCategories().subscribe(
      (data: any) => {
        this.allCategories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModal(content: any, type: string) {
    if (type === 'project' && !this.kyc) {
      return document.getElementById('viewKyc')?.click();
    }
    this.form.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
    });
  }

  onOrganizationQuestionnaireClick(modal: any) {
    const array: any = [];
    this.allQuestions.forEach((val: any) => {
      if (val.answer) {
        array.push({
          questionId: val.questionId,
          answer: val.answer,
        });
      }
    });
    if (array.length === 0) {
      return this.sweetAlert.errorMessage('No question is answered');
    }
    this.btnPrefLoadingSubject.next(true);
    this.questionnairesService
      .answerOrganizationQuestions(this.questions.id, {answers: array})
      .subscribe(
        (data: any) => {
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.successMessage('Answers submitted successfully!');
          this.showKyc = true;
          modal.close('');
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
          this.btnPrefLoadingSubject.next(false);
        }
      );
  }

  onCreateOrUpdateProjectClick(modal: any) {
    const {valid, value} = this.form;
    if (valid && value) {
      value.entrepreneurId = this.entrepreneurId;
      this.btnPrefLoadingSubject.next(true);
      const sub = this.projectService.createProject(value).subscribe(
        (data: any) => {
          // this.allProjects.unshift(data);
          this.sweetAlert.successMessage('Project created successfully!');
          this.btnPrefLoadingSubject.next(false);
          modal.close('');
        },
        (error) => {
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  ngOnDestroy(): void {
  }

  resendVerificationMail() {
    this.dataLoadingSubject.next(true);
    const userInfo = this.storage.getStorage(environment.USERDATA_KEY);
    this.verifyService.resendEmail(userInfo.email).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.successMessage("Mail sent");
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }
}
