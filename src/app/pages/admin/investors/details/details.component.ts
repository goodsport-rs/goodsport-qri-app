import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';

import {InvestorService} from 'src/app/core/services/investor.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {findIndex} from 'lodash';
import {InvestmentService} from "../../../../core/services/investment.service";

@Component({
  selector: 'app-investor-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class InvestorDetailsComponent implements OnInit, OnDestroy {
  closeResult = '';
  investorId: string;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  investorDetails: any;
  selectedCategories: any = [];
  investments: any = [];
  page = 1;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private service: InvestorService,
    private investmentService: InvestmentService,
    private sweetAlert: SweetAlertService
  ) {
    this.investorId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  ngOnInit(): void {
    this.getInvestor();
    this.getInvestments();
  }

  getInvestor() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findInvestorById(this.investorId).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.investorDetails = data;
        const {categories, selectedCategoryIds} = this.investorDetails;
        this.selectedCategories = [];
        selectedCategoryIds.forEach((val: any) => {
          const index = findIndex(categories, {id: val});
          if (index > -1) {
            this.selectedCategories.push({
              id: val,
              name: categories[index].name,
            });
          }
        });
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onPageChange() {
    this.getInvestments();
  }

  getInvestments() {
    const sub = this.investmentService.findInvestmentsByInvestor(this.investorId, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.investments = data.content;

      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }
}
