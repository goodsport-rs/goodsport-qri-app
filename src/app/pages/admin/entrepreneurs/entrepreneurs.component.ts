import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EntrepreneurService } from 'src/app/core/services/entrepreneurs.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-entrepreneurs',
  templateUrl: './entrepreneurs.component.html',
  styleUrls: ['./entrepreneurs.component.scss'],
})
export class EntrepreneursComponent implements OnInit, OnDestroy {
  allEntrepreneurs: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  page = 1;
  totalItems = 0;

  // Create entrepreneur form
  form: FormGroup;
  emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numRegex = /^[0-9+]+$/;

  constructor(
    private service: EntrepreneurService,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllEntrepreneurs();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group(
      {
        username: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        phoneNumber: [
          null,
          [
            Validators.required,
            Validators.maxLength(14),
            Validators.minLength(9),
            Validators.pattern(this.numRegex),
          ],
        ],
        organizationName: [null, [Validators.required]],
        organizationNumber: [
          null,
          [
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
          ],
        ],
      },
      {
        validator: (control: FormGroup) => {
          const password = control.get('password')?.value;
          const confirmPassword = control.get('confirmPassword')?.value;
          if (password !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ ConfirmPassword: true });
          }
        },
      }
    );
  }

  openCreateModal(content: any) {
    this.form.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  onClickSubmit(modal: any) {
    const { valid, value } = this.form;
    if (valid && value) {
      this.btnLoadingSubject.next(true);
      const payload = { ...value, accountType: 'entrepreneur' };
      const sub = this.authService.signup(payload).subscribe(
        () => {
          this.sweetAlert.successMessage('Entrepreneur created successfully!');
          this.btnLoadingSubject.next(false);
          modal.close('');
          this.getAllEntrepreneurs();
        },
        (error: any) => {
          this.btnLoadingSubject.next(false);
          const msg = error?.error?.message || error?.message || 'Failed to create entrepreneur';
          this.sweetAlert.errorMessage(msg);
        }
      );
      this.unsubscribe.push(sub);
    } else {
      this.sweetAlert.errorMessage('Please fill all required fields correctly');
      Object.keys(this.form.controls).forEach((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
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
