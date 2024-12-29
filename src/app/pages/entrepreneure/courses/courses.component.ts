import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { ProjectService } from 'src/app/core/services/project.service';
import { SweetAlertService } from 'src/app/core/services/alert.service';

@Component({
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  allCourses: any = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];

  constructor(
    private service: ProjectService,
    private sweetAlert: SweetAlertService,
    private _sanitizer: DomSanitizer
  ) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.findProjectCourses().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        data.forEach((val: any) => {
          const obj = val;
          let videoLink = obj.link;
          const isYoutube = obj.link.search('youtube.com');
          if (isYoutube > -1) {
            const videoId = obj.link.split('=');
            videoLink = `https://www.youtube.com/embed/${
              videoId[videoId.length - 1]
            }`;
          }
          const url = this._sanitizer.bypassSecurityTrustResourceUrl(videoLink);
          obj.link = url;
          this.allCourses.push(obj);
        });
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        this.sweetAlert.errorMessage(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
