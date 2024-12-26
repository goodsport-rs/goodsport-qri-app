import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';

import { InvestorService } from 'src/app/core/services/investor.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { findIndex } from 'lodash';
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
  dropdownList = [];
  selectedCategories: any = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };
  form: UntypedFormGroup;
  logoUrl: string;
  updatedCategories: any = [];

  constructor(
    private modalService: NgbModal,
    private service: InvestorService,
    private sweetAlert: SweetAlertService,
    private fb: UntypedFormBuilder
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.btnPrefLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnPrefLoading$ = this.btnPrefLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getProfile();
    // this.getAllCategories();
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
          Validators.maxLength(14),
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
        const { categories, selectedCategoryIds } = this.profileDetails;
        this.dropdownList = categories;
        this.selectedCategories = [];
        selectedCategoryIds.forEach((val: any) => {
          const index = findIndex(categories, { id: val });
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
  }

  getAllCategories() {
    const sub = this.service.findAllCategories().subscribe(
      (data: any) => {
        this.dropdownList = data;
        this.selectedCategories = data;
      },
      (error) => {
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
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
    } else if (type === 'preferences') {
      this.updatedCategories = cloneDeep(this.selectedCategories);
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  onUpdatePreferences(modal: any) {
    const array: any = [];
    this.updatedCategories.forEach((val: any) => {
      array.push(val.id);
    });
    this.btnPrefLoadingSubject.next(true);
    const sub = this.service.updateInvestorPreferences(array).subscribe(
      (data: any) => {
        this.profileDetails = data;
        const { categories, selectedCategoryIds } = this.profileDetails;
        this.dropdownList = categories;
        this.selectedCategories = [];
        this.updatedCategories = [];
        selectedCategoryIds.forEach((val: any) => {
          const index = findIndex(categories, { id: val });
          if (index > -1) {
            this.selectedCategories.push({
              id: val,
              name: categories[index].name,
            });
          }
        });
        this.btnPrefLoadingSubject.next(false);
        this.sweetAlert.successMessage('Preferences updated successfully!');
        modal.close('');
      },
      (error) => {
        this.btnPrefLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  onClickEditUpdate(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      this.btnPrefLoadingSubject.next(true);
      const sub = this.service.updateInvestorProfile(value).subscribe(
        (data: any) => {
          this.profileDetails = data;
          const { categories, selectedCategoryIds } = this.profileDetails;
          this.dropdownList = categories;
          this.selectedCategories = [];
          selectedCategoryIds.forEach((val: any) => {
            const index = findIndex(categories, { id: val });
            if (index > -1) {
              this.selectedCategories.push({
                id: val,
                name: categories[index].name,
              });
            }
          });
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
          this.sweetAlert.successMessage('Profile image updated successfully!');
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

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
