import {Component, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from 'src/app/core/services/project.service';

@Component({
  selector: 'app-addreport1',
  templateUrl: './addreport1.component.html',
  styleUrls: ['./addreport1.component.scss']
})
export class Addreport1Component implements OnInit {
  form: FormGroup;
  model: NgbDateStruct;
  editData: any;
  constructor(public activeModal: NgbActiveModal, private projService: ProjectService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.projService.getEditReport()) {
      this.editData = this.projService.getEditReport();
    this.makeEditForm();
    }
  }

  makeEditForm() {
    this.form.patchValue({
      id: this.editData.data.id,
      locality: this.editData.data.locality,
      location: this.editData.data.location,
      title: this.editData.data.title
    });
    this.setReportDate(this.editData.data);
  }



  setReportDate(val: any) {
    if (val.reportDate) {
      let dob = val.reportDate;
      const [year, month, day] = dob.split('-');
      const obj = { year: parseInt(year), month: parseInt(month), day:
        parseInt(day.split(' ')[0].trim()) };
      this.form.patchValue({
        reportDate: obj
      })
      }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [],
      reportDate: [null,[Validators.required]],
      locality: ['',[Validators.required]],
      location: ['',[Validators.required]],
      title: ['', [Validators.required]],
    })
  }

  continue(v: string): void {
    this.projService.setReportData({from: 'rep1', data: this.form.value});
    this.projService.setContinueTo(v);
  }

}
