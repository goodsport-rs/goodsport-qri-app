import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ProjectService} from 'src/app/core/services/project.service';
import {EntrepreneurService} from 'src/app/core/services/entrepreneurs.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  allProjects: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  projectPhase: string = '';
  page = 1;
  totalItems = 0;
  projectPhases: any = [];
  totalPage: 0;
  projectStatuses: any = [];
  projectStatus: string = '';
  entrepreneurFilter: string = '';

  // Create project form
  form: FormGroup;
  allCategories: any = [];
  allEntrepreneurs: any = [];
  selectedEntrepreneur: any = null;
  remainingText: number;
  descriptionLength: any;
  spaceRegex = /^$|.*\S+.*/;

  constructor(
    private service: ProjectService,
    private entrepreneurService: EntrepreneurService,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllProjects();
    this.getProjectPhases();
    this.getProjectStatuses();
    this.initForm();
    this.getAllCategories();
    this.getAllEntrepreneurs();
  }

  getAllProjects() {
    this.allProjects = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findAllProjects(this.search, this.projectPhase, this.projectStatus, this.page, 10, this.entrepreneurFilter)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allProjects = data.content;
          this.totalItems = data.totalElements;
          this.totalPage = data.totalPages;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllProjects();
  }

  onPhaseSearch() {
    this.getAllProjects();
  }

  onPageChange() {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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

  getProjectStatuses() {
    const sub = this.service.findProjectStatuses().subscribe(
      (data: any) => {
        this.projectStatuses = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  initForm() {
    this.form = this.fb.group({
      entrepreneurId: ['', Validators.required],
      title: ['', [Validators.required, Validators.pattern(this.spaceRegex), Validators.maxLength(255)]],
      foundingAmount: ['', [Validators.required, Validators.pattern(this.spaceRegex)]],
      fundingInterval: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.pattern(this.spaceRegex), Validators.maxLength(1024), Validators.minLength(50)]],
      categoryId: ['', Validators.required],
      investorCampaignCode: [''],
    });
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
    this.unsubscribe.push(sub);
  }

  getAllEntrepreneurs() {
    const sub = this.entrepreneurService
      .findAllEntrepreneurs('', 1, 500)
      .subscribe(
        (data: any) => {
          this.allEntrepreneurs = data?.content || data || [];
        },
        (error) => {
          console.log('Error loading entrepreneurs:', error);
        }
      );
    this.unsubscribe.push(sub);
  }

  openCreateModal(content: any) {
    this.form.reset();
    this.selectedEntrepreneur = null;
    this.descriptionLength = '';
    this.remainingText = 1000;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    const {valid, value} = this.form;
    if (valid && value) {
      this.btnLoadingSubject.next(true);
      const sub = this.service.createProject(value).subscribe(
        (data: any) => {
          this.sweetAlert.successMessage('Project created successfully!');
          this.btnLoadingSubject.next(false);
          modal.close('');
          this.getAllProjects();
        },
        (error) => {
          this.btnLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
      this.unsubscribe.push(sub);
    } else {
      this.sweetAlert.errorMessage('Project has validation errors!');
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  valueChange(descriptionLength: any) {
    this.remainingText = 1000 - (descriptionLength ? descriptionLength.length : 0);
  }

  onEntrepreneurChange() {
    const selectedId = this.form.get('entrepreneurId')?.value;
    this.selectedEntrepreneur = this.allEntrepreneurs.find(
      (e: any) => e.id?.toString() === selectedId?.toString()
    ) || null;
  }
}
