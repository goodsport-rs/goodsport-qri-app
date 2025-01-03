import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';

import {StorageService} from 'src/app/auth/guards/storage.service';
import {environment} from 'src/environments/environment';
import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {QuestionnairesService} from 'src/app/core/services/questionnaires.service';
import {EntrepreneurService} from 'src/app/core/services/entrepreneurs.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  form: FormGroup;
  entrepreneurId: string;
  allCategories: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  page = 1;
  totalPages = 0;
  allProjects: any = [];
  allQuestions: any = [];
  questions: any;
  kyc = false;
  spaceRegex = /^$|.*\S+.*/;
  profileDetails: any;
  profile: any;
  search = '';

  projectPhases: any;
  projectPhase = '';
  remainingText: number;
  descriptionLength: any ;


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private storage: StorageService,
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private quesService: QuestionnairesService,
    private entrepreneurService: EntrepreneurService
  ) {
    const storageObj = this.storage.getStorage(environment.USERDATA_KEY);
    this.entrepreneurId = storageObj?.userId;
    this.kyc = storageObj?.kyc;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getMe();
    this.getAllProjects();
    this.initForm();
    this.getAllCategories();

    this.getProjectPhases();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(this.spaceRegex),Validators.maxLength(255)]],
      foundingAmount: ['', [Validators.required, Validators.pattern(this.spaceRegex)]],
      fundingInterval: ['', [Validators.required, Validators.pattern(this.spaceRegex)]],
      description: ['', [Validators.required, Validators.pattern(this.spaceRegex),Validators.maxLength(1024),Validators.minLength(50)]],
      categoryId: ['', Validators.required],
      investorCampaignCode: ['',],
    });
  }

  getMe() {
    console.log('getMe');
    this.dataLoadingSubject.next(true);
    this.entrepreneurService.findMe().subscribe(
      (data: any) => {
        this.profile = data;
        const userInfo = this.storage.getStorage(environment.USERDATA_KEY);
        userInfo.kyc = data.organizationKYCDone;
        this.storage.setStorage(environment.USERDATA_KEY, userInfo);
        this.dataLoadingSubject.next(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProjectPhases() {
    const sub = this.service.findProjectPhases().subscribe(
      (data: any) => {
        this.projectPhases = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }


  getAllProjects() {
    this.dataLoadingSubject.next(true);
    this.service.findAllProjects(this.search, this.projectPhase, '', this.page, 10).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allProjects = data.content;
        this.totalPages = data.totalElements;
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
    const sub = this.service.findAllCategories().subscribe(
      (data: any) => {
        this.allCategories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModal(content: any, type: string) {

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    const {valid, value} = this.form;
    if (valid && value) {
      value.entrepreneurId = this.entrepreneurId;
      this.btnLoadingSubject.next(true);
      const sub = this.service.createProject(value).subscribe(
        (data: any) => {
          this.allProjects.unshift(data);
          this.sweetAlert.successMessage('Project created successfully!');
          this.btnLoadingSubject.next(false);
          modal.close('');
        },
        (error) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.errorMessage(
            error
          );
        }
      );
    } else {
      this.sweetAlert.errorMessage('Project has validation errors!');
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  onEnterSearch() {
    this.getAllProjects();
  }

  onPhaseSearch() {
    this.getAllProjects();
  }

  valueChange(descriptionLength: any) {
    this.remainingText = 1000 - descriptionLength.length;
  }
}
