import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/core/services/project.service';
import * as moment from 'moment';

@Component({
  selector: 'app-addreport3',
  templateUrl: './addreport3.component.html',
  styleUrls: ['./addreport3.component.scss']
})
export class Addreport3Component implements OnInit {

  form: FormGroup;
  otherFormData: any;
  projectId: any;
  id: any;
  editData: any;

  constructor(private formBuilder: FormBuilder, private activeModal: NgbActiveModal,
    private projService: ProjectService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.id = this.projService.getProjectId();
    this.otherFormData = this.projService.getReportData();
    if (this.projService.getEditReport()) {
      this.makeEditForm();
      }
  }

  makeEditForm() {
    this.editData = this.projService.getEditReport();
    let val = this.editData.data;
    this.form.patchValue({
      leaders: val.leaders,
      spectator: val.spectator ,
      parents: val.parents,
      duration: val.duration,
      summary: val.summary
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      leaders: [''],
      spectator: [''],
      parents: [''],
      duration: [''],
      summary: ['']
    })
  }

  submit(): void {
    let payload = {...this.form.value, ...this.otherFormData.rep1, ...this.otherFormData.rep2};
    let rpDt = payload.reportDate;
    let finalDt = new Date(rpDt.year, rpDt.month-1, rpDt.day);
  payload.reportDate = moment(finalDt).format('YYYY-MM-DD HH:mm:ss');
    // payload.reportDate = finalDt;
    if (this.editData && this.editData.status === 'edit') {
      this.projService.updateProjectReport(payload, this.editData.reportId, this.editData.projectId).subscribe((res) => {
        this.activeModal.close(true);
      }, (err) =>{
        this.activeModal.close(false);
      })
    } else {
      this.projService.createReport(payload, this.id).subscribe((res) => {
        this.activeModal.close(true);
      }, (err) =>{
        this.activeModal.close(false);
      })
    }
  }
}
