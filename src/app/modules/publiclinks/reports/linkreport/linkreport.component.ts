import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ProjectService } from 'src/app/core/services/project.service';

interface SubmittedReportResponse {
  username?: string;
  receiptId?: string;
  reportId?: number;
}

@Component({
  selector: 'app-linkreport',
  templateUrl: './linkreport.component.html',
  styleUrls: ['./linkreport.component.scss']
})
export class LinkreportComponent implements OnInit {
  form: FormGroup;
  model: NgbDateStruct;
  editData: any;
  id = '';
  btnStatus = 'rep1';
  projectTitle = '';
  organizationName = '';
  projectImageUrl = '';
  reportContextLoading = false;
  reportContextError = false;
  reportLinkInvalid = false;
  isSubmitting = false;
  submitted = false;
  submittedReport: Record<string, any> | null = null;
  receiptId = '';
  reportId?: number;
  submitError = '';

  readonly today: NgbDateStruct = this.toDateStruct(new Date());

  private readonly stepOneControls = ['title', 'email', 'reportDate', 'locality', 'location', 'duration'];
  private readonly stepTwoControls = [
    'maleParticipants', 'femaleParticipants', 'newMaleParticipants', 'newFemaleParticipants',
    'children', 'youth', 'adults', 'leaders'
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private projService: ProjectService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getReportContext();
    if (this.projService.getEditReport()) {
      this.editData = this.projService.getEditReport();
      this.makeEditForm();
    }
  }

  get totalParticipants(): number {
    return this.numberValue('maleParticipants') + this.numberValue('femaleParticipants');
  }

  get totalAgeGroups(): number {
    return this.numberValue('children') + this.numberValue('youth') + this.numberValue('adults');
  }

  get reportDateLabel(): string {
    const date = this.submittedReport?.reportDate || this.form.get('reportDate')?.value;
    if (!date) return '–';
    const value = typeof date === 'string'
      ? new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)))
      : new Date(date.year, date.month - 1, date.day);
    return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
  }

  getReportContext(): void {
    this.id = this.getReportLinkId();
    if (!this.id) {
      this.reportContextError = true;
      this.reportLinkInvalid = true;
      return;
    }

    this.reportContextLoading = true;
    this.reportContextError = false;
    this.reportLinkInvalid = false;
    this.projService.getPublicReportContext(this.id).subscribe({
      next: (data: any) => {
        this.projectTitle = data?.title || '';
        this.organizationName = data?.organizationName || '';
        this.projectImageUrl = data?.imageUrl || '';
        this.reportContextLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.reportContextError = true;
        this.reportLinkInvalid = error.status === 400 || error.status === 404;
        this.reportContextLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  makeEditForm(): void {
    this.form.patchValue(this.editData.data);
    this.setReportDate(this.editData.data);
  }

  setReportDate(value: any): void {
    if (!value.reportDate) return;
    const [year, month, day] = value.reportDate.split('-');
    this.form.patchValue({
      reportDate: { year: Number(year), month: Number(month), day: Number(day.split(' ')[0]) }
    });
  }

  buildForm(): void {
    const requiredCount = [Validators.required, Validators.min(0), this.integerValidator()];
    const optionalCount = [Validators.min(0), this.integerValidator()];

    this.form = this.formBuilder.group({
      id: [],
      reportDate: [null, [Validators.required, this.notFutureDateValidator()]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      locality: ['', [Validators.required, this.trimmedMinLength(2), Validators.maxLength(100)]],
      location: ['', [Validators.required, this.trimmedMinLength(2), Validators.maxLength(150)]],
      title: ['', [Validators.required, this.trimmedMinLength(2), Validators.maxLength(150)]],
      femaleParticipants: ['', requiredCount],
      newFemaleParticipants: ['', [...requiredCount, this.notGreaterThan('femaleParticipants')]],
      unaccompaniedMinors: [0],
      newUnaccompaniedMinors: [0],
      newMaleParticipants: ['', [...requiredCount, this.notGreaterThan('maleParticipants')]],
      maleParticipants: ['', requiredCount],
      children: ['', requiredCount],
      youth: ['', requiredCount],
      adults: ['', requiredCount],
      leaders: [0, optionalCount],
      spectator: [0, optionalCount],
      parents: [0, optionalCount],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(1440), this.integerValidator()]],
      summary: ['', [Validators.maxLength(2000)]]
    }, { validators: this.participantsSumValidator });

    this.revalidateWhenBaseChanges('maleParticipants', 'newMaleParticipants');
    this.revalidateWhenBaseChanges('femaleParticipants', 'newFemaleParticipants');
  }

  goToStep(step: 'rep1' | 'rep2' | 'rep3'): void {
    if (step === 'rep2' && !this.validateControls(this.stepOneControls)) {
      this.btnStatus = 'rep1';
      return;
    }
    if (step === 'rep3') {
      if (!this.validateControls(this.stepOneControls)) {
        this.btnStatus = 'rep1';
        this.scrollToForm();
        return;
      }
      if (!this.validateControls(this.stepTwoControls) || this.form.hasError('participantsSumInvalid')) {
        this.form.markAllAsTouched();
        this.btnStatus = 'rep2';
        this.scrollToForm();
        return;
      }
    }
    this.btnStatus = step;
    this.submitError = '';
    this.scrollToForm();
  }

  addReport(): void {
    if (this.isSubmitting) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.submitError = 'Kontrollera de markerade fälten innan du skickar rapporten.';
      this.goToFirstInvalidStep();
      return;
    }

    const raw = this.form.getRawValue();
    const date = raw.reportDate as NgbDateStruct;
    const payload = {
      ...raw,
      reportDate: moment([date.year, date.month - 1, date.day]).format('YYYY-MM-DD HH:mm:ss'),
      title: raw.title.trim(),
      email: raw.email.trim(),
      locality: raw.locality.trim(),
      location: raw.location.trim(),
      summary: raw.summary?.trim() || '',
      unaccompaniedMinors: 0,
      newUnaccompaniedMinors: 0,
      leaders: Number(raw.leaders || 0),
      spectator: Number(raw.spectator || 0),
      parents: Number(raw.parents || 0)
    };

    this.isSubmitting = true;
    this.submitError = '';
    this.projService.saveReportFromField(this.id, payload).subscribe({
      next: (response: SubmittedReportResponse) => {
        this.submittedReport = payload;
        this.receiptId = response?.receiptId || '';
        this.reportId = response?.reportId;
        this.submitted = true;
        this.isSubmitting = false;
        this.scrollToForm();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.submitError = this.getErrorMessage(error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitAnotherReport(): void {
    this.form.reset({
      unaccompaniedMinors: 0,
      newUnaccompaniedMinors: 0,
      leaders: 0,
      spectator: 0,
      parents: 0
    });
    this.submitted = false;
    this.submittedReport = null;
    this.receiptId = '';
    this.reportId = undefined;
    this.submitError = '';
    this.btnStatus = 'rep1';
    this.scrollToForm();
  }

  fieldInvalid(controlName: string, errorName?: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && (errorName ? control.hasError(errorName) : control.invalid);
  }

  private getReportLinkId(): string {
    return this.route.snapshot.paramMap.get('id')
      || this.route.parent?.snapshot.paramMap.get('id')
      || window.location.pathname.split('/').filter(Boolean).pop()
      || '';
  }

  private validateControls(controlNames: string[]): boolean {
    controlNames.forEach(name => this.form.get(name)?.markAsTouched());
    return controlNames.every(name => this.form.get(name)?.valid);
  }

  private goToFirstInvalidStep(): void {
    if (!this.validateControls(this.stepOneControls)) this.btnStatus = 'rep1';
    else if (!this.validateControls(this.stepTwoControls) || this.form.hasError('participantsSumInvalid')) this.btnStatus = 'rep2';
    else this.btnStatus = 'rep3';
    this.scrollToForm();
  }

  private numberValue(controlName: string): number {
    return Number(this.form?.get(controlName)?.value || 0);
  }

  private participantsSumValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const names = ['femaleParticipants', 'maleParticipants', 'youth', 'adults', 'children'];
    if (names.some(name => group.get(name)?.value === '' || group.get(name)?.value === null)) return null;
    const participants = Number(group.get('femaleParticipants')?.value) + Number(group.get('maleParticipants')?.value);
    const ageGroups = Number(group.get('youth')?.value) + Number(group.get('adults')?.value) + Number(group.get('children')?.value);
    return participants === ageGroups ? null : { participantsSumInvalid: true };
  }

  private integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '' || control.value === null || control.value === undefined) return null;
      return Number.isInteger(Number(control.value)) ? null : { integer: true };
    };
  }

  private notGreaterThan(baseControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const base = control.parent?.get(baseControlName);
      if (!base || control.value === '' || base.value === '') return null;
      return Number(control.value) <= Number(base.value) ? null : { greaterThanTotal: true };
    };
  }

  private notFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as NgbDateStruct;
      if (!value?.year || !value?.month || !value?.day) return null;
      const selected = new Date(value.year, value.month - 1, value.day);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected > today ? { futureDate: true } : null;
    };
  }

  private trimmedMinLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return String(control.value).trim().length >= length ? null : { minlength: true };
    };
  }

  private revalidateWhenBaseChanges(baseName: string, dependentName: string): void {
    this.form.get(baseName)?.valueChanges.subscribe(() => {
      this.form.get(dependentName)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Det gick inte att nå servern. Kontrollera din anslutning och försök igen.';
    if (error.status === 404) return 'Rapportlänken är inte giltig eller har gått ut.';
    const body = error.error;
    const message = body?.message || body?.exp || body?.error;
    if (error.status === 400 || error.status === 422) {
      if (message === 'Invalid report link') return 'Rapportlänken är inte giltig eller har gått ut.';
      if (typeof message === 'string' && message.trim() && message !== '[object Object]') {
        return message;
      }
      return 'Rapporten innehåller uppgifter som inte kunde godkännas. Kontrollera formuläret och försök igen.';
    }
    return 'Rapporten kunde inte skickas just nu. Dina uppgifter finns kvar – försök gärna igen.';
  }

  private scrollToForm(): void {
    setTimeout(() => document.querySelector('.report-screen')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  private toDateStruct(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
}
