import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {UsersService} from "../../../core/services/users.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-investors',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  allUsers: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;
  totalPages = 0;
  form: FormGroup;

  constructor(
    private service: UsersService,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();

  }

  ngOnInit(): void {
    this.getAllUsers();
    this.initForm();
  }

  getAllUsers() {
    console.log('Fetching all users');
    this.allUsers = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service.findAllUsers(this.search, this.page).subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.allUsers = data.content;
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
    this.getAllUsers();
  }

  onPageChange() {
    this.getAllUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]

    });
  }

  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
    });
  }


  onClickSave(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnLoadingSubject.next(true);
      const { username, password } = value;
      const sub = this.service
        .createUser({ username, password })
        .subscribe(
          (data: any) => {
            this.allUsers.unshift(data);
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage(
              'Admin added!'
            );
            modal.close('');
            this.form.reset();
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
}
