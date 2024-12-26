import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { EntrepreneurService } from 'src/app/core/services/entrepreneurs.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';

@Component({
  selector: 'app-entrepreneur-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class EntrepreneurDetailsComponent implements OnInit, OnDestroy {
  closeResult = '';
  entrepreneurId: string;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  entrepreneurDetails: any;
  allAnswers: any;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private service: EntrepreneurService,
    private sweetAlert: SweetAlertService,
    private quesService: QuestionnairesService
  ) {
    this.entrepreneurId = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.getEntrepreneur();
  }

  getEntrepreneur() {
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findEntrepreneurById(this.entrepreneurId)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.entrepreneurDetails = data;
          if (data.organizationKYCDone) {
            this.getSubmittedKyc();
          }
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  getSubmittedKyc() {
    this.dataLoadingSubject.next(true);
    this.quesService
      .getSubmittedQuestionnaire(this.entrepreneurDetails.organizationId)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allAnswers = data.questionAnswers;
        },
        (error) => {
          // console.log(error);
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
