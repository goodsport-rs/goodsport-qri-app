import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { SweetAlertService } from 'src/app/core/services/alert.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { AddquestionComponent } from '../createquestions/addquestion/addquestion.component';
import * as lodash from 'lodash';
import * as bootstrap from 'bootstrap';
// import { SortablejsOptions } from 'ngx-sortablejs';
// import { SortablejsOptions } from 'ngx-sortablejs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";



@Component({
  selector: 'app-qstgroups',
  templateUrl: './qstgroups.component.html',
  styleUrls: ['./qstgroups.component.scss']
})
export class QstgroupsComponent implements OnInit {
  questions: any;
  gOptions: any;
  qOptions: any;
  questionsOrder: any = [];
  groups: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  deleteLoading$: Observable<boolean>;
  deleteLoadingSubject: BehaviorSubject<boolean>;
  statusLoading$: Observable<boolean>;
  statusLoadingSubject: BehaviorSubject<boolean>;
  publishLoading$: Observable<boolean>;
  publishLoadingSubject: BehaviorSubject<boolean>;
  updateLoading$: Observable<boolean>;
  updateLoadingSubject: BehaviorSubject<boolean>;
  grpName = new FormControl('', Validators.required);
  grpForm: any;
  questionId: any;
  questionnaireId: string;
  questionnaireDetails: any;
  pendingUpdate: boolean;
  name = 'Angular ';
    cateories = [
    {
      title: 'Accordion Item 1',
      children: [{ title: 'Child 1.1' }, { title: 'Child 1.2' }]
    },
    {
      title: 'Accordion Item 2',
      children: [{ title: 'Child 2.1' }, { title: 'Child 2.2' }]
    },
    {
      title: 'Accordion Item 3',
      children: [
        { title: 'Child 3.1' },
        { title: 'Child 3.2' },
        { title: 'Child 3.3' }
      ]
    }
  ];

  constructor(private modalService: NgbModal, 
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private service: QuestionnairesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
      this.gOptions = {
        onUpdate: (event: any) => {
          return;
          // console.log('grp changes', event);
        }
      };
      this.qOptions = {
        onUpdate: (event: any) => {
          return;
        }
      };
    this.pendingUpdate = false;
    this.questionnaireId = this.route.snapshot.params.id;
    this.statusLoadingSubject = new BehaviorSubject<boolean>(false);
    this.statusLoading$ = this.statusLoadingSubject.asObservable();
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
    this.deleteLoadingSubject = new BehaviorSubject<boolean>(false);
    this.deleteLoading$ = this.deleteLoadingSubject.asObservable();
    this.publishLoadingSubject = new BehaviorSubject<boolean>(false);
    this.publishLoading$ = this.publishLoadingSubject.asObservable();
    this.updateLoadingSubject = new BehaviorSubject<boolean>(false);
    this.updateLoading$ = this.updateLoadingSubject.asObservable();
   }

  ngOnInit(): void {
    this.getQuestionnaire();
  }


  getQuestionnaire() {
    this.dataLoadingSubject.next(true);
    this.service
      .findOneQuestionnaire(this.questionnaireId)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.questionnaireDetails = data;
          this.formGroupView();
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

    formGroupView() {
      const q = this.questionnaireDetails;
      if (q && q.questions && q.questions.length) {
      let allQ = q.questions;      
        let grpArr = lodash.uniq(lodash.map(allQ, 'groupName'));
        let a: any = [];
        grpArr.forEach((v: any) => {
          let b: any= {};
          b.questions = []
          b.groupName = v;
          for(let k of allQ) {
            if (k.groupName === v) {
              b.questions.push(k);
            }
          }
          a.push(b);
        })
        this.groups = a;
        this.cdr.detectChanges();
      }
    }

    openChildAcc(cont: any) {
      let myCollapse = document.getElementById(cont) as HTMLElement
      var bsCollapse = new bootstrap.Collapse(myCollapse, {
        toggle: true
      })
    }

    delete(id: any) {
      this.service
      .removeQuestion(this.questionnaireId, id)
      .subscribe(
        (data: any) => {
          this.cdr.markForCheck();
          this.deleteLoadingSubject.next(false);
          this.sweetAlert.successMessage('Question deleted successfully!');
          // this.questionnaireDetails = data;
          this.getQuestionnaire()
        },
        (error) => {
          this.deleteLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      ); 
    }

    edit(d: any, grp: string) {
      const ref = this.modalService.open(AddquestionComponent, {
        ariaLabelledBy: 'modal-basic-title',
        // size: 'lg',
        centered: true,
      });
      ref.componentInstance.fromParent = {id: this.questionnaireId, grpName: grp ,editData: d};
      ref.result.then((res: any) => {
        this.getQuestionnaire();
      })
    }

  openAddQuestion(grp: string, gIndex: number, qIndex: number) {
    const ref = this.modalService.open(AddquestionComponent, {
      ariaLabelledBy: 'modal-basic-title',
      // size: 'lg',
      centered: true,
    });
//    console.log(gIndex);
//    console.log(qIndex);
    ref.componentInstance.fromParent = {id: this.questionnaireId, grpName: grp, groupIndex: gIndex, questionIndex: qIndex};
    ref.result.then((res: any) => {
      this.getQuestionnaire();
    }, (reason) => {
    });
  }

  addGroup(cnt: any) {
    this.grpForm = this.formBuilder.group({
      grpName: ['', Validators.required]});
    const ref = this.modalService.open(cnt, {
      ariaLabelledBy: 'modal-basic-title',
      // size: 'lg',
      centered: true,
    });
  }

  onClickPublish() {
    this.publishLoadingSubject.next(true);
    const sub = this.service
      .publishQuestionnaire(this.questionnaireId)
      .subscribe(
        (data: any) => {
          this.publishLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Questionnaire published successfully!'
          );
          this.questionnaireDetails = data;
          this.router.navigate(['admin/questionnaires'])
        },
        (error) => {
          this.publishLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }


  drop(event: CdkDragDrop<any[]>) {
    this.pendingUpdate = true;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
  

  onClickUpdate() {
    this.updateLoadingSubject.next(true);
    this.questionsOrder = [];
    this.groups.forEach((value: any, groupIndex: any) => {
      let questions = value.questions;
      questions.forEach((q: any, questionIndex: any) => {
        this.questionsOrder.push({
          id: q.id,
          groupOrder: groupIndex,
          questionOrder: questionIndex
        });
      });
    });

    const sub = this.service
      .updateQuestionnaireOrder(this.questionnaireId, this.questionsOrder)
      .subscribe(
        (data: any) => {
          this.updateLoadingSubject.next(false);
          this.sweetAlert.successMessage(
            'Question Orders Updated successfully!'
          );
          this.questionnaireDetails = data;
          this.pendingUpdate = false;
        },
        (error) => {
          this.updateLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
  }

  submit(modal: any, data: string) {
    this.statusLoadingSubject.next(true);
    this.groups.push({
      groupName: data,
      questions: []
    });
    modal.close();
    this.statusLoadingSubject.next(false);
  }


}
