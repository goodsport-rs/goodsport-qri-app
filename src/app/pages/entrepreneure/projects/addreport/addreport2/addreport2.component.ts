import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/core/services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-addreport2',
  templateUrl: './addreport2.component.html',
  styleUrls: ['./addreport2.component.scss']
})
export class Addreport2Component implements OnInit {
  form: FormGroup;
  editData: any;

  constructor(public activeModal: NgbActiveModal, private projService: ProjectService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.projService.getEditReport()) {
      this.makeEditForm();
      }
  }

  makeEditForm() {
    this.editData = this.projService.getEditReport();
    let val = this.editData.data;
    this.form.patchValue({
      femaleParticipants: val.femaleParticipants,
      newFemaleParticipants: val.newFemaleParticipants ,
      unaccompaniedMinors: val.unaccompaniedMinors ,
      newUnaccompaniedMinors: val.newUnaccompaniedMinors,
      newMaleParticipants: val.newMaleParticipants,
      maleParticipants: val.maleParticipants
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      femaleParticipants: ['', [Validators.required]],
      newFemaleParticipants: ['', [Validators.required]],
      unaccompaniedMinors: ['', [Validators.required]],
      newUnaccompaniedMinors: ['', [Validators.required]],
      newMaleParticipants: ['', [Validators.required]],
      maleParticipants: ['', [Validators.required]],
    })
  }

  continue(v: string): void {
    this.projService.setReportData({from: 'rep2', data: this.form.value});
    this.projService.setContinueTo(v);
  }

}
