import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { isEmpty } from 'lodash';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailComponent implements OnInit {
  formsCount = 6;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;
  signupData: any = {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
  };
  private unsubscribe: Subscription[] = [];
  projectId: string;
  projectDetails: any;
  comments: string = '';
  projectPhases = ['IDEA', 'PLAN', 'FUNDING', 'REPORTING', 'FINAL_REPORT'];
  currentPhase: any = 0;

  constructor(
    private sweetAlert: SweetAlertService,
    private service: ProjectService,
    private cdk: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.projectId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.statusLoadingSubject = new BehaviorSubject<boolean>(false);
    this.statusLoading$ = this.statusLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getProjectDetails();
  }

  getProjectDetails() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findProjectById(this.projectId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.projectDetails = data;
        this.currentPhase = this.projectPhases.indexOf(data.projectPhase);
        this.currentStep$.next(this.currentPhase + 1);
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  updateAccount = (data: any, isFormValid: boolean) => {
    this.signupData[this.currentStep$.value] = data;
    this.isCurrentFormValid$.next(isFormValid);
    this.cdk.detectChanges();
  };

  nextStep() {
    // const error = this.showErrors();
    // if (error) {
    //   return this.sweetAlert.errorMessage(error);
    // }
    // if (this.currentStep$.value === 3) {
    //   this.checkEmail();
    // } else if (this.currentStep$.value === 6) {
    //   this.onClickSubmit();
    // } else if (this.currentStep$.value === 7) {
    //   this.onClickValidate();
    // } else {

    // }
    // if (this.currentStep$.value === 4) {
    //   return;
    // }

    console.log('Current phase is ' + this.projectDetails.projectPhase);

    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.signupData[nextStep] && !isEmpty(this.signupData[nextStep])) {
      this.forwardData(nextStep);
    }
    this.currentStep$.next(nextStep);
  }

  showErrors(): string {
    if (this.currentStep$.value === 2) {
      if (this.signupData[2].tools.length === 0) {
        return 'Atleast one tool must be selected';
      }
    } else if (this.currentStep$.value === 4) {
      if (
        this.signupData[4].personalInfo &&
        this.signupData[4].personalInfo.cnicExpiryDate &&
        this.signupData[4].personalInfo.cnicIssueDate &&
        this.signupData[4].personalInfo.cnicExpiryDate <
          this.signupData[4].personalInfo.cnicIssueDate
      ) {
        return 'CNIC expiry date must greater than issue date.';
      }
    } else if (this.currentStep$.value === 5) {
      if (
        this.signupData[5].businessInfo.isRegistered &&
        !this.signupData[5].file
      ) {
        return 'Legal document is required in case of registered buisness';
      } else if (
        !this.signupData[5].businessInfo.niche ||
        this.signupData[5].businessInfo.niche.length === 0
      ) {
        return 'Niche is required';
      }
    }
    return '';
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.forwardData(prevStep);
    this.currentStep$.next(prevStep);
  }

  forwardData(step: number) {
    if (step === 2) {
      return this.account$.next(this.signupData[step]['tools']);
    } else if (step === 4) {
      return this.account$.next(this.signupData[step]['personalInfo']);
    } else if (step === 5) {
      return this.account$.next(this.signupData[step]['businessInfo']);
    } else if (step === 6) {
      return this.account$.next(this.signupData[step]['billingInfo']);
    } else {
      return this.account$.next(this.signupData[step]);
    }
  }

  onClickApproveReject(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onClickPopupBtn(modal: any, type: string) {
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .approveRejectProject(this.projectId, type)
      .subscribe(
        (data: any) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project status updated successfully!'
          );
          modal.close('');
          this.projectDetails = data;
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onClickRework(modal: any) {
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .reworkProject(this.projectId, { comment: this.comments })
      .subscribe(
        () => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project status updated successfully!'
          );
          modal.close('');
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  notifyChild(event: any) {
    this.projectDetails = event;
    const index = this.projectPhases.indexOf(event.projectPhase);
    this.currentStep$.next(index + 1);
    this.currentPhase = this.projectPhases.indexOf(event.projectPhase);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isStepValid(step: number): boolean {
    const phaseIndex = this.projectPhases.indexOf(this.projectDetails?.projectPhase);
    return phaseIndex >= step - 1;
  }
}
