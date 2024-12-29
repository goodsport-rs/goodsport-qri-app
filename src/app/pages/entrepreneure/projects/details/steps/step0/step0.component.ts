import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { environment } from 'src/environments/environment';
import { findIndex } from 'lodash';

@Component({
  selector: 'app-signup-step0',
  templateUrl: './step0.component.html',
})
export class Step0Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
  private unsubscribe: Subscription[] = [];
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  form: FormGroup;
  storageObj: any;
  allCategories: any = [];
  spaceRegex = /^$|.*\S+.*/;

  uploadLoading$: Observable<boolean>;
  uploadLoadingSubject: BehaviorSubject<boolean>;
  upload: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private storage: StorageService
  ) {
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
    this.storageObj = this.storage.getStorage(environment.userKey);
  }

  ngOnInit() {
    this.initForm();
    this.getAllCategories();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(this.spaceRegex)]],
      description: [
        '',
        [Validators.required, Validators.pattern(this.spaceRegex)],
      ],
      categoryId: ['', Validators.required],
    });
  }

  getAllCategories() {
    const sub = this.service.findAllCategories().subscribe(
      (data: any) => {
        this.allCategories = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModal(content: any) {
    const index = findIndex(this.allCategories, {
      name: this.projectDetails.category,
    });
    this.form.patchValue({
      title: this.projectDetails.title,
      description: this.projectDetails.description,
      categoryId: this.allCategories[index].id,
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  onClickUpdate(modal: any) {
    const { value, valid } = this.form;
    if (value && valid) {
      if (
        value.title === this.projectDetails.title &&
        value.description === this.projectDetails.description
      ) {
        return this.sweetAlert.errorMessage(
          "Couldn't be sent for review. Update any value to re-submit"
        );
      }
      this.btnLoadingSubject.next(true);
      value.id = this.projectDetails.id;
      value.entrepreneurId = this.storageObj.userId;
      this.service
        .updateProject(this.projectDetails.id, 'IDEA', value)
        .subscribe(
          (data: any) => {
            this.btnLoadingSubject.next(false);
            this.sweetAlert.successMessage(
              'Project details updated successfully!'
            );
            modal.close('');
            this.projectDetails = data;
            this.updateParent.next(data);
          },
          (error) => {
            console.log(error);
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(
              'Process could not be completed. Make sure you have entered the valid input.'
            );
          }
        );
    }
  }

  refresh(): void {
    window.location.reload();
  }

  onUploadFile(event: any) {
    if (event && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.uploadLoadingSubject.next(true);
      this.service
        .uploadImage(this.projectDetails.id, formData)
        .subscribe(
          (data: any) => {
            console.log("Uploading");
            this.sweetAlert.successMessage("File uploaded successfully");
            this.projectDetails = data;
            this.updateParent.next(data);
            this.uploadLoadingSubject.next(false);
          },
          (error) => {
            this.sweetAlert.errorMessage(error);
            this.uploadLoadingSubject.next(false);
          }
        );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
