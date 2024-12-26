import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { StorageService } from 'src/app/auth/guards/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projectdetail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  projectDetails: any;
  projectId: string;
  private unsubscribe: Subscription[] = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  allDocuments: any = [];
  projectPlanDetails: any = [];
  form: UntypedFormGroup;
  url: any;

  constructor(
    private sweetAlert: SweetAlertService,
    private service: ProjectService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private storage: StorageService
  ) {
    this.projectId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.url = `${environment.baseUrl}/projects/id/${this.projectId}/files/id/`;
  }

  ngOnInit(): void {
    this.getProjectDetails();
    // this.getFiles();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      fundingInterval: ['', Validators.required],
      fundingAmount: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(7)]),
      ],
      foundingDuration: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(2)]),
      ],
    });
  }

  getProjectDetails() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findProjectById(this.projectId).subscribe(
      (data: any) => {
        // this.dataLoadingSubject.next(false);
        this.projectDetails = data;
        this.getFiles();
        this.getPlanQuestions();
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getPlanQuestions() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findProjectPhaseQuestionnaires(this.projectDetails.id, 'PLAN')
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.projectPlanDetails = data.questionAnswers;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  getFiles() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.getProjectFiles(this.projectId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allDocuments = data;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  onClickViewIcon(file: any) {
    const sub = this.service
      .downloadProjectFile(this.projectId, file.id)
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
    this.unsubscribe.push(sub);
  }

  openModal(content: any) {
    this.form.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      // size: 'lg',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    const user = this.storage.getStorage(environment.userKey);
    const obj = {
      projectId: this.projectId,
      investorId: user.userId,
    };
    this.btnLoadingSubject.next(true);
    const sub = this.service.fundProject(obj).subscribe(
      () => {
        this.btnLoadingSubject.next(false);
        this.sweetAlert.successMessage('Interest submitted successfully!');
        modal.close('');
        this.form.reset();
      },
      (error) => {
        this.btnLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
