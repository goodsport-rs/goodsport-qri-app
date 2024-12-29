import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {


  ngOnInit(): void {

    console.log('testing about content');
  }

  initForm() {


  }


  ngOnDestroy(): void {
  }
}
