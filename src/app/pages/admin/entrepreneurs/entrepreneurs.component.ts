import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { EntrepreneurService } from 'src/app/core/services/entrepreneurs.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-entrepreneurs',
  templateUrl: './entrepreneurs.component.html',
  styleUrls: ['./entrepreneurs.component.scss'],
})
export class EntrepreneursComponent implements OnInit, OnDestroy {
  allEntrepreneurs: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;

  constructor(
    private service: EntrepreneurService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllEntrepreneurs();
  }

  getAllEntrepreneurs() {
    this.allEntrepreneurs = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findAllEntrepreneurs(this.search, this.page)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allEntrepreneurs = data.content;
          this.totalItems = data.totalElements;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllEntrepreneurs();
  }

  onPageChange() {
    this.getAllEntrepreneurs();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
