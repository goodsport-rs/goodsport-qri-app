import {Component, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
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
      newFemaleParticipants: ['', [Validators.required, this.validateNewParticipants('femaleParticipants')]],
      unaccompaniedMinors: ['', [Validators.required]],
      newUnaccompaniedMinors: ['', [Validators.required, this.validateNewParticipants('unaccompaniedMinors')]],
      newMaleParticipants: ['', [Validators.required, this.validateNewParticipants('maleParticipants')]],
      maleParticipants: ['', [Validators.required]],
      children: ['', [Validators.required]],
      youth: ['', [Validators.required]],
      adults: ['', [Validators.required]],
      leaders: [''],
      spectator: [''],
      parents: [''],
      duration: [''],
      summary: ['']
    }, { validators: this.participantsSumValidator });
  }

  validateNewParticipants(baseControlName: string) {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const baseControl = control.parent ? control.parent.get(baseControlName) : null;
      if (baseControl && control.value > baseControl.value) {
        return { 'newParticipantsInvalid': true };
      }
      return null;
    };
  }
  
  participantsSumValidator(formGroup: FormGroup) {
    const femaleParticipants = formGroup.get('femaleParticipants')?.value;
    const maleParticipants = formGroup.get('maleParticipants')?.value;
    const youth = formGroup.get('youth')?.value;
    const adults = formGroup.get('adults')?.value;
    const children = formGroup.get('children')?.value;
  
    if (femaleParticipants === null || maleParticipants === null || youth === null || adults === null || children === null) {
      // Handle null values if needed
      return null; // or return an error if it's not acceptable
    }
  
    const sumParticipants = femaleParticipants + maleParticipants;
    const sumAgeGroups = youth + adults + children;
    
    if (sumParticipants !== sumAgeGroups) {
      console.log('sumParticipants:', sumParticipants);
      console.log('sumAgeGroups:', sumAgeGroups);
      return { 'participantsSumInvalid': { sumParticipants: sumParticipants, sumAgeGroups: sumAgeGroups } };
    }
  
    return null;
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

    this.projService.saveReportFromField(this.id, payload).subscribe((res) => {

      this.sweetAlert.successMessage("Rapporten har skickats");

      setTimeout(() => {
        window.location.reload();
      }, 5000);

    }, (err) => {
      console.log("failed to add report")
      this.sweetAlert.errorMessage(err);
    })
  }

}
