import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { InvestorService } from 'src/app/core/services/investor.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { InvestmentService } from 'src/app/core/services/investment.service';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
})
export class InvestorsComponent implements OnInit, OnDestroy {
  allInvestors: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private investorService: InvestorService,

    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllInvestors();
  }

  getAllInvestors() {
    this.allInvestors = [];
    this.dataLoadingSubject.next(true);
    const sub = this.investorService.findAllInvestors(this.search, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allInvestors = data.content;
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
    this.getAllInvestors();
  }

  onPageChange() {
    this.getAllInvestors();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
