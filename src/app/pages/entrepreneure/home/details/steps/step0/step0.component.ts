import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { findIndex } from 'lodash';
import { StorageService } from 'src/app/auth/guards/storage.service';

@Component({
  selector: 'app-signup-step0',
  templateUrl: './step0.component.html',
})
export class Step0Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  private unsubscribe: Subscription[] = [];
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  form: FormGroup;
  storageObj: any;
  allCategories: any = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private storage: StorageService
  ) {
    this.btnLoadingSubject = new BehaviorSubject<boolean>(false);
    this.btnLoading$ = this.btnLoadingSubject.asObservable();
    this.storageObj = this.storage.getStorage(environment.USERDATA_KEY);
  }

  ngOnInit() {
    this.initForm();
    this.getAllCategories();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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
          },
          (error) => {
            console.log(error);
            this.btnLoadingSubject.next(false);
            this.sweetAlert.errorMessage(error);
          }
        );
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
