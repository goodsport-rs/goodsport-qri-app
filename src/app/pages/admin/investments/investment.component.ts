import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { InvestorService } from 'src/app/core/services/investor.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import {InvestmentService} from "../../../core/services/investment.service";

@Component({
  selector: 'app-investors',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss'],
})
export class InvestmentComponent implements OnInit, OnDestroy {
  investmentList: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private service: InvestmentService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllInvestments();
  }

  getAllInvestments() {
    this.investmentList = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service.findInvestments(this.search, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.investmentList = data.content;
        this.totalItems = data.totalElements;
        this.totalPages = data.totalPages;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllInvestments();
  }

  onPageChange() {
    this.getAllInvestments();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
