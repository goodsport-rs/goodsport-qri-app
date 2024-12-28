import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';

import {ProjectService} from 'src/app/core/services/project.service';
import {SweetAlertService} from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  allProjects: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  search: string = '';
  projectPhase: string = '';
  page = 1;
  totalItems = 0;
  projectPhases: any = [];
  totalPage: 0;
  projectStatuses: any = [];
  projectStatus: string = '';

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllProjects();
    this.getProjectPhases();
    this.getProjectStatuses();
  }

  getAllProjects() {
    this.allProjects = [];
    this.dataLoadingSubject.next(true);
    const sub = this.service
      .findAllProjects(this.search, this.projectPhase, this.projectStatus, this.page, 10)
      .subscribe(
        (data: any) => {
          this.dataLoadingSubject.next(false);
          this.allProjects = data.content;
          this.totalItems = data.totalElements;
          this.totalPage = data.totalPages;
        },
        (error) => {
          this.dataLoadingSubject.next(false);
          this.sweetAlert.errorMessage(error);
        }
      );
    this.unsubscribe.push(sub);
  }

  onEnterSearch() {
    this.getAllProjects();
  }

  onPhaseSearch() {
    this.getAllProjects();
  }

  onPageChange() {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getProjectPhases() {
    const sub = this.service.findProjectPhases().subscribe(
      (data: any) => {
        this.projectPhases = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectStatuses() {
    const sub = this.service.findProjectStatuses().subscribe(
      (data: any) => {
        this.projectStatuses = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.unsubscribe.push(sub);
  }
}
