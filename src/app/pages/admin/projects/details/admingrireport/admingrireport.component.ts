import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {SweetAlertService} from 'src/app/core/services/alert.service';
import {ProjectService} from 'src/app/core/services/project.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ViewgriComponent} from '../viewgri/viewgri.component';

@Component({
  selector: 'app-admingrireport',
  templateUrl: './admingrireport.component.html',
  styleUrls: ['./admingrireport.component.scss']
})
export class AdmingrireportComponent implements OnInit {
  @Input() projectDetails: any;
  dataLoading$: Observable<boolean>;
  exportLoading$: Observable<boolean>;
  exportLoadingSubject: BehaviorSubject<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  btnLoading$: Observable<boolean>;
  btnLoadingSubject: BehaviorSubject<boolean>;
  @ViewChild('content') content: ElementRef;
  viewData: any;
  page = 1;
  projectId: any;
  pageSize = 4;
  reports: any
  activeIds: any = [];
  questionnaireName : string = '';

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  private unsubscribe: any;
  private questionnaireId: any;
  private questionnaireStatus: any;

  constructor(private projService: ProjectService,
              private modalService: NgbModal,
              private sweetAlert: SweetAlertService, private route: ActivatedRoute,) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.projectId = this.route.snapshot.params.id;
    this.exportLoadingSubject = new BehaviorSubject<boolean>(false);
    this.exportLoading$ = this.exportLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getList();
  }

  save() {
    this.dataLoadingSubject.next(true);
    let payload = {projectId: 0, groups: this.reports}
    this.projService
      .doSaveReport(this.projectId, payload)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.getList();
          this.sweetAlert.successMessage('Report saved successfully!');
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
          this.dataLoadingSubject.next(false);
        }
      );
  }

  getList() {
    this.dataLoadingSubject.next(true);
    this.projService.getFinalReportList(this.projectId).subscribe((data: any) => {
      this.viewData = data;
      this.questionnaireId = data.id;
      this.questionnaireName = data.questionnaireName;
      this.questionnaireStatus = data.status;
      if (data && data.groups && data.groups.length) {
        this.reports = data ? data['groups'] : undefined;
        data.groups.forEach((v: any, i: number) => {
          this.activeIds.push(`acc-${i}`);
        })
        this.dataLoadingSubject.next(false);
      }
    }, (err) => {
      this.dataLoadingSubject.next(false);
      // this.sweetAlert.errorMessage('Failed to load');
    })
  }


  openView(obj: any) {
    const modalRef = this.modalService.open(ViewgriComponent, {size: 'md'});
    modalRef.componentInstance.fromParent = obj;
    modalRef.result.then((data) => {
      // on close
    }, (reason) => {
      // on dismiss

    });
  }


  print(e: any) {
    this.exportLoadingSubject.next(true);
    let docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [150, 200, 200, 150],

            body: [
              ['Question', 'Answer', 'Decision']
            ]
          }
        }
      ]
    }

    for (let i of this.reports) {
      for (let k of i.entries) {
        const arr = [];
        arr.push(k.question);
        k.answer ? arr.push(k.answer) : arr.push('N/A');
        arr.push(k.decision);
        docDefinition.content[0].table.body.push(arr
        )
      }
    }
  //  pdfMake.createPdf(docDefinition).download('final_gri_report.pdf');
    this.exportLoadingSubject.next(false);
  }

  resetFinalReport() {
    this.projService.resetReport(this.projectId).subscribe()

    const sub = this.projService
      .resetReport(this.projectId)
      .subscribe(
        (data: any) => {
          this.sweetAlert.successMessage(
            'Project Deleted approved successfully!'
          );
        },
        (error) => {
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

}
