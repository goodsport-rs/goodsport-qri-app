import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';


import { SweetAlertService } from 'src/app/core/services/alert.service';

import { environment } from 'src/environments/environment';
import {StorageService} from "../../../../auth/guards/storage.service";
import {AuthService} from "../../services/auth.service";
import {ConfirmPasswordValidator} from "../registration/confirm-password.validator";

@Component({
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  step = 1;
  form: FormGroup;
  passRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
  emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  numRegex = /^[0-9+]+$/;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private sweetAlert: SweetAlertService,
    private router: Router,
    private storage: StorageService
  ) {
    this.isLoading$ = this.service.isLoading$;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group(
      {
        accountType: ['entrepreneur', Validators.required],
        username: [
          null,
          [Validators.required, Validators.pattern(this.emailRegex)],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            // Validators.pattern(this.passRegex),
          ],
        ],
        confirmPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            // Validators.pattern(this.passRegex),
          ],
        ],
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
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  onClickButton() {
    if (this.step === 1) {
      const { username, password, confirmPassword } = this.form.controls;
      if (username.errors || password.errors || confirmPassword.errors) {
        username.markAsTouched();
        password.markAsTouched();
        confirmPassword.markAsTouched();
        return;
      }
      this.step = 2;
    } else {
      const { value, valid } = this.form;
      if (value && valid) {
        const values = cloneDeep(value);
        // values.phoneNumber = `+46${value.phoneNumber}`;
        const sub = this.service.signup(values).subscribe(
          () => {
            const type =
              value.accountType === 'investor' ? 'Investor' : 'Entrepreneur';
            this.sweetAlert.successMessage(
              `${type} account created successfully!`
            );
            this.submit({
              username: value.username,
              password: value.password,
            });
          },
          (error) => {
            if (error && error.error) {
              this.sweetAlert.errorMessage(error.error.message);
            }
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

  submit(value: any) {
    const loginNewlyCreatedUser = this.service.login(value.username,value.password).subscribe(
      (data: any) => this.service.getUserInfo(data),
      (error) => {
        this.service.isLoadingSubject.next(false);
        if (error && error.error) {
          this.sweetAlert.errorMessage(error.error.message);
        }
      }
    );
    this.unsubscribe.push(loginNewlyCreatedUser);
  }


}
