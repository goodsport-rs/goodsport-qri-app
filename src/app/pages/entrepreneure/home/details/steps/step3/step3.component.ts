import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-signup-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @Input() projectId: string;
  allAnswers: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit() {
    // this.getPlanQuestions();
  }

  getPlanQuestions() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findProjectPhaseQuestionnaires(this.projectId, 'REPORTING')
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allAnswers = data.questionAnswers;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
