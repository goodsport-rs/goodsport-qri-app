import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from "../../../core/services/project.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-investors',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit, OnDestroy {
  allMedia: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  page = 1;
  totalItems = 0;
  totalPages = 0;
  form: FormGroup;
  search: any;


  constructor(
    private projectService: ProjectService,
    private sweetAlert: SweetAlertService,
    private _sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {

    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllMedia();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      link: ['', Validators.required]
    });
  }

  getAllMedia() {
    this.dataLoadingSubject.next(true);
    const sub = this.projectService.findAllMedia().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allMedia = data;
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

  onPageChange() {

  }

  onClickSave(modal: any) {


    const {value, valid} = this.form;
    console.log(value);
    if (value && valid) {
      this.btnLoadingSubject.next(true);

      const sub = this.projectService
        .saveMedia(value)
        .subscribe(
          (data: any) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage(
              'Media added!'
            );
            modal.close('');
            this.form.reset();
            this.getAllMedia();
          },
          (error) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(
              'Process could not be completed. Make sure you have entered the valid input.'
            );
          }
        );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
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
