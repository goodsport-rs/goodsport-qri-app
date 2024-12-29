import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-viewgri',
  templateUrl: './viewgri.component.html',
  styleUrls: ['./viewgri.component.scss']
})
export class ViewgriComponent implements OnInit {

  
  @Input() fromParent: any;
  viewData: any;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  constructor( public activeModal: NgbActiveModal, 
    private sweetAlert: SweetAlertService,
    private projService: ProjectService
  ) { 
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
      this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.dataLoadingSubject.next(true);
    if (this.fromParent) {
      this.viewData = this.fromParent;
        this.dataLoadingSubject.next(false);
    } else {
      this.dataLoadingSubject.next(false);
      this.activeModal.close(true);
      this.sweetAlert.errorMessage('No Data found');
    }
  }

  close() {
    this.activeModal.close(true);
  }
}
