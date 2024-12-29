import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EntrepreneurService } from 'src/app/core/services/entrepreneurs.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnPrefLoading$: Observable<boolean>;
  btnPrefLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  profileDetails: any;
  form: FormGroup;
  logoUrl: string;
  allAnswers: any;

  constructor(
    private modalService: NgbModal,
    private service: EntrepreneurService,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder,
    private quesService: QuestionnairesService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnPrefLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnPrefLoading$ = this.btnPrefLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getProfile();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(9),
        ],
      ],
      organizationName: [null, [Validators.required]],
      organizationNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(9),
        ],
      ],
    });
  }

  getProfile() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findMe().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        this.profileDetails = data;
        if (data.organizationKYCDone) {
          this.getSubmittedKyc();
        }
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }

  openModal(content: any, type: string) {
    if (type === 'profile') {
      this.form.reset();
      this.form.patchValue({
        firstName: this.profileDetails.firstName,
        lastName: this.profileDetails.lastName,
        phoneNumber: this.profileDetails.phoneNumber,
        organizationName: this.profileDetails.organizationName,
        organizationNumber: this.profileDetails.organizationNumber,
      });
    } else if (type === 'image') {
      this.logoUrl = '';
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onUpdateLogoImage(modal: any) {
    if (!this.logoUrl) {
      return this.sweetAlert.errorMessage('Image url is required');
    }
    this.btnPrefLoadingSubject.next(true);
    this.service
      .uploadLogoImage(this.profileDetails.organizationId, {
        logoUrl: this.logoUrl,
      })
      .subscribe(
        (data: any) => {
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.successMessage('Profile updated successfully!');
          this.profileDetails.imageUrl = data.logoUrl;
          modal.close('');
        },
        (error) => {
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.errorMessage(
            'Invalid file format. Only .png, .jpg and .jpeg files are allowed'
          );
        }
      );
  }

  onClickEditUpdate(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnPrefLoadingSubject.next(true);
      const sub = this.service.updateEntrepreneurProfile(value).subscribe(
        (data: any) => {
          this.profileDetails = data;
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.successMessage('Profile updated successfully!');
          modal.close('');
        },
        (error) => {
          this.btnPrefLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
      this.unsubscribe.push(sub);
    } else {
      Object.keys(this.form.controls).map((ctrl) => {
        this.form.controls[ctrl].markAsTouched();
      });
    }
  }

  getSubmittedKyc() {
    this.dataLoadingSubject.next(true);
    this.quesService
      .getSubmittedQuestionnaire(this.profileDetails.organizationId)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allAnswers = data.questionAnswers;
        },
        (error) => {
          // console.log(error);
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
