import {Component, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VerifyService} from "../../../core/services/verify.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  private verificationToken: any;
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  successfulVerificationDone: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private verifyService: VerifyService,
  ) {
    this.verificationToken = this.route.snapshot.params.id;
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

  ngOnInit(): void {

    this.verificationToken = this.route.snapshot.params.id;
    console.log("token verification check " + this.verificationToken);
    this.dataLoadingSubject.next(true);
    const sub = this.verifyService.verifyEmailWithToken(this.verificationToken).subscribe(
      (data: any) => {
        console.log(data);
        this.dataLoadingSubject.next(false);
        this.successfulVerificationDone = true;
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        console.log(error);

        console.log("Token verification failed " +error) ;
        this.successfulVerificationDone = false;

      }
    );

  }

  routeToHome() {
    this.router.navigate(['/']);
  }
}
