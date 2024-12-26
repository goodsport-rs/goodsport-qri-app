import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { SweetAlertService } from 'src/app/core/services/alert.service';
import { InvestorService } from 'src/app/core/services/investor.service';
import {InvestmentService} from "../../../core/services/investment.service";
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  allProjects: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalPages = 0;

  constructor(
    private service: InvestorService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.allProjects = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findInvestorProjects(this.search, this.page, 10)
      .subscribe(
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
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllProjects();
  }

  onPageChange() {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
