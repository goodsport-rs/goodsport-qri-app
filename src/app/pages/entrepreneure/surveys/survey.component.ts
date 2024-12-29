import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';


@Component({
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  surveysList: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  unsubscribe: Subscription[] = [];

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    public _sanitizer: DomSanitizer
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.findAllSurveys();
  }

  findAllSurveys() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findSurveys().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.surveysList = data;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
