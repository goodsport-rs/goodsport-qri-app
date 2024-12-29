import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
})
export class CompanyInfoComponent implements OnInit, OnDestroy {


  ngOnInit(): void {

    console.log('testing about content');
  }

  initForm() {


  }


  ngOnDestroy(): void {
  }
}
