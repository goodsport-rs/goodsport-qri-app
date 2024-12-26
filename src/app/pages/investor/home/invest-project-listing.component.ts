import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';

import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {environment} from "../../../../environments/environment";
import {VerifyService} from "../../../core/services/verify.service";
import {StorageService} from "../../../auth/guards/storage.service";
import {InvestorService} from 'src/app/core/services/investor.service';
import {ActivatedRoute, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './invest-project-listing.component.html',
  styleUrls: ['./invest-project-listing.component.scss'],
})
export class InvestProjectListingComponent implements OnInit, OnDestroy {
  allProjects: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;
  totalPages = 0;
  profile: any;
  isUserVerified = true;
  state: 'fund';

  constructor(
    private projectService: ProjectService,
    private investorService: InvestorService,
    private sweetAlert: SweetAlertService,
    private storage: StorageService,
    private verifyService: VerifyService,
    private route: ActivatedRoute,
  ) {
    this.state = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();


  }

  ngOnInit(): void {
    this.getMe();
    this.getAllProjects();
  }

  getMe() {
    this.dataLoadingSubject.next(true);
    this.investorService.findMe().subscribe(
      (data: any) => {
        this.profile = data;
        const userInfo = this.storage.getStorage(environment.userKey);
        this.isUserVerified = data.verified;
        this.storage.setStorage(environment.userKey, userInfo);
        this.dataLoadingSubject.next(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllProjects() {
    console.log("state =" + this.state);
    this.allProjects = [];

    this.dataLoadingSubject.next(true);
    const sub = this.investorService
      .findInvestorProjectsByState(this.search, this.state, this.page, 10)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allProjects = data.content;
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
    this.getAllProjects();
  }

  onPageChange() {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  resendVerificationMail() {
    this.dataLoadingSubject.next(true);
    const userInfo = this.storage.getStorage(environment.userKey);
    this.verifyService.resendEmail(userInfo.email).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.successMessage("Mail sent");
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }
}
