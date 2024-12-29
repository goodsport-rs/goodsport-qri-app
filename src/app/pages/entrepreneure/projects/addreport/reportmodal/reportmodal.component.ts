import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-reportmodal',
  templateUrl: './reportmodal.component.html',
  styleUrls: ['./reportmodal.component.scss']
})
export class ReportmodalComponent implements OnInit {

  show: string = 'rep1';

  constructor(private projService: ProjectService) { }

  ngOnInit(): void {
    this.projService.continueTo.asObservable().subscribe((val) => {
      if (val) {
        this.show = val;
      }
    });
  }

}
