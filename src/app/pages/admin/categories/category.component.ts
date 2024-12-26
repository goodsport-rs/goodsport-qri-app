import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from "../../../core/services/project.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-investors',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  allCategories: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  page = 1;
  totalItems = 0;
  totalPages = 0;
  form: any;
  search: any;

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {

    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findAllCategories().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allCategories = data;
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

  }

  onClickSave(modal: any) {

  }

  onEnterSearch() {

  }

  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
    });
  }
}
