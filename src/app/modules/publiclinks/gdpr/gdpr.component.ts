import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent implements OnInit, OnDestroy {


  ngOnInit(): void {

    console.log('testing about content');
  }

  initForm() {


  }


  ngOnDestroy(): void {
  }
}
