import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-signup-step0',
  templateUrl: './step0.component.html',
})
export class Step0Component implements OnInit, OnDestroy {
  @Input() projectDetails: any;
  @Output() updateParent = new EventEmitter();
  private unsubscribe: Subscription[] = [];
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  comments: string = '';
  spaceRegex = /^$|.*\S+.*/;
  uploadLoading$: Observable<boolean>;
  uploadLoadingSubject: BehaviorSubject<boolean>;
  upload: any;
  constructor(
    private modalService: NgbModal,
    private service: ProjectService,
    private sweetAlert: SweetAlertService
  ) {
    this.statusLoadingSubject = new BehaviorSubject<boolean>(false);
    this.statusLoading$ = this.statusLoadingSubject.asObservable();
    this.uploadLoadingSubject = new BehaviorSubject<boolean>(false);
    this.uploadLoading$ = this.uploadLoadingSubject.asObservable();
  }

  ngOnInit() {}

  onClickApproveReject(content: any) {
    this.comments = '';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onClickPopupBtn(modal: any, type: string) {
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .approveRejectProject(this.projectDetails.id, type)
      .subscribe(
        (data: any) => {
          this.projectDetails = data;
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage('Project IDEA approved successfully!');
          modal.close('');
          this.updateParent.next(data);
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onClickRework(modal: any) {
    if (!this.comments) {
      return this.sweetAlert.errorMessage('Comment is required');
    }
    if (!this.spaceRegex.test(this.comments)) {
      return this.sweetAlert.errorMessage('Only white spaces are not allowed');
    }
    this.statusLoadingSubject.next(true);
    const sub = this.service
      .reworkProject(this.projectDetails.id, { comment: this.comments })
      .subscribe(
        (data: any) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Project status updated successfully!'
          );
          modal.close('');
          this.projectDetails = data;
          this.updateParent.next(data);
        },
        (error) => {
          this.statusLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
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
