import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { InvestmentService } from 'src/app/core/services/investment.service';

@Component({
  selector: 'app-projectdetail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  projectDetails: any;
  projectId: string;
  private unsubscribe: Subscription[] = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  allDocuments: any = [];
  projectPlanDetails: any = [];
  investments: any = [];

  constructor(
    private sweetAlert: SweetAlertService,
    private service: ProjectService,
    private investmentService: InvestmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getProjectDetails();
    // this.getFiles();
  }

  getProjectDetails() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findProjectById(this.projectId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.projectDetails = data;
        this.getFiles();
        this.getPlanQuestions();
        this.getProjectInvestments();
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectInvestments() {
    this.dataLoadingSubject.next(true);
    const sub = this.investmentService.findInvestmentsByProjectId(this.projectId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.investments = data;
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
