import {Component, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from 'src/app/core/services/project.service';
import {ActivatedRoute} from '@angular/router';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-linkreport',
  templateUrl: './linkreport.component.html',
  styleUrls: ['./linkreport.component.scss']
})
export class LinkreportComponent implements OnInit {
  form: FormGroup;
  model: NgbDateStruct;
  editData: any;
  id: any;
  btnStatus = 'rep1';

  constructor(public activeModal: NgbActiveModal, private projService: ProjectService,
              private route: ActivatedRoute, private formBuilder: FormBuilder, private sweetAlert: SweetAlertService,) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.btnStatus = 'rep1';
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
    });
    this.setReportDate(this.editData.data);
  }


  setReportDate(val: any) {
    if (val.reportDate) {
      let dob = val.reportDate;
      const [year, month, day] = dob.split('-');
      const obj = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day.split(' ')[0].trim())
      };
      this.form.patchValue({
        reportDate: obj
      })
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [],
      reportDate: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      locality: ['', [Validators.required]],
      location: ['', [Validators.required]],
      title: ['', [Validators.required]],
      femaleParticipants: ['', [Validators.required]],
      newFemaleParticipants: ['', [Validators.required]],
      unaccompaniedMinors: ['', [Validators.required]],
      newUnaccompaniedMinors: ['', [Validators.required]],
      newMaleParticipants: ['', [Validators.required]],
      maleParticipants: ['', [Validators.required]],
      leaders: [''],
      spectator: [''],
      parents: [''],
      duration: [''],
      summary: ['']
    })
  }

  continue(val: string): void {
    console.log("Sending report " + val);
    this.btnStatus = val;
    if (val === 'submit') {
      this.addReport();
    }
  }

  addReport() {
    let payload = {...this.form.value};
    let rpDt = payload.reportDate;
    let finalDt = new Date(rpDt.year, rpDt.month - 1, rpDt.day);
    payload.reportDate = moment(finalDt).format('YYYY-MM-DD HH:mm:ss');
    // payload.reportDate = finalDt;
    console.log("adding report")
    if (this.editData && this.editData.status === 'edit') {
      this.projService.updateProjectReport(payload, this.editData.reportId, this.editData.projectId).subscribe((res) => {
        this.sweetAlert.successMessage('Report updated successfully');
      }, (err) => {
        this.sweetAlert.errorMessage(err);
      })
    } else {
      this.projService.postReportLink(this.id, payload).subscribe((res) => {

        setTimeout(() => {
          window.location.reload();
        }, 1500);
        // window.location.reload();
      }, (err) => {

      })
    }
  }
}
