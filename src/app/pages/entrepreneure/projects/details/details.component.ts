import {Component, OnInit, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import {isEmpty} from 'lodash';
import {BehaviorSubject, Subscription, Observable} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from 'src/app/core/services/project.service';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailComponent implements OnInit {
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  startLoading$: Observable<boolean>;
  startLoadingSubject: BehaviorSubject<boolean>;
  isLoading$: Observable<boolean>;
  signupData: any = {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
  };
  private unsubscribe: Subscription[] = [];
  projectId: string;
  projectDetails: any;
  projectPhases = ['IDEA', 'PLAN', 'FUNDING', 'REPORTING', 'FINAL_REPORT'];
  currentPhase: any = 0;

  constructor(
    private sweetAlert: SweetAlertService,
    private service: ProjectService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.projectId = this.route.snapshot.params.id;

    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();

    this.statusLoadingSubject = new BehaviorSubject<boolean>(false);
    this.statusLoading$ = this.statusLoadingSubject.asObservable();

    this.startLoadingSubject = new BehaviorSubject<boolean>(false);
    this.startLoading$ = this.startLoadingSubject.asObservable();
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

  onClickStart(modal: any) {
    this.startLoadingSubject.next(true);
    this.service.startProject(this.projectDetails.id).subscribe(
      (data: any) => {
        this.startLoadingSubject.next(false);
        this.sweetAlert.successMessage('Project started successfully!');
        this.projectDetails = data;
        this.currentPhase = this.projectPhases.indexOf(data.projectPhase);
        modal.close('');
      },
      (error) => {
        console.log(error);
        this.sweetAlert.errorMessage(error);
        this.startLoadingSubject.next(false);
      }
    );
  }

  notifyChild(event: any) {
    this.projectDetails = event;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  isStepValid(step: number): boolean {
    const phaseIndex = this.projectPhases.indexOf(this.projectDetails?.projectPhase);
    return phaseIndex >= step - 1;
  }
}
