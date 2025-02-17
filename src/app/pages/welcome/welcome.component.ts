import { Component } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;


}
