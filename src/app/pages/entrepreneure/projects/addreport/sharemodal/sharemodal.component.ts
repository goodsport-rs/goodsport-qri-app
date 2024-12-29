import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/core/services/project.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertService } from 'src/app/core/services/alert.service';

export function nameValidator(control: FormControl) {
  let name = control.value;
  if (name) {
    var letters = /^[A-Za-z]+$/;
   if(name.value.match(letters))
     {
      return true;
     }
   else
     {
     return false;
     }
  }
  return false; 
}

@Component({
  selector: 'app-sharemodal',
  templateUrl: './sharemodal.component.html',
  styleUrls: ['./sharemodal.component.scss']
})

export class SharemodalComponent implements OnInit {

  form: FormGroup;
  id: any;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  constructor(private formBuilder: FormBuilder,
     public activeModal: NgbActiveModal,
     private sweetAlert: SweetAlertService,  
     private projService: ProjectService) { 
      this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
      this.dataLoading$ = this.dataLoadingSubject.asObservable();
     }

  ngOnInit(): void {
    this.buildForm();
    this.id = this.projService.getProjectId();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  submit() {
    this.dataLoadingSubject.next(true);
    const payload = JSON.parse(JSON.stringify(this.form.value));
    this.projService.doShareReport(payload, this.id).subscribe((val) => {
      this.activeModal.close(true);
      this.dataLoadingSubject.next(false);
      this.sweetAlert.successMessage('Successfully shared the link');
    }, (err) => {
      this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage('Failed to share link');
    });
  }

  cancel() {
    this.activeModal.close(true);
  }

}
