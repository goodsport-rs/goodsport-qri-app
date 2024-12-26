import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { StatisticsService } from 'src/app/core/services/statistics.service';

@Component({
  selector: 'app-home',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit, OnDestroy {
  categoryLoading$: Observable<boolean>;
  categoryLoadingSubject: BehaviorSubject<boolean>;
  userLoading$: Observable<boolean>;
  userLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];


  categoryChart: any = {
    series: [
      {
        name: 'Project Count',
        data: [],
//      desc: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: true,
      },
    },
    colors: ['#ffbb00'],
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '10%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 20,
      colors: ['transparent'],
    },

    xaxis: {
      categories: [],
      title: {
        text: 'No. of projects',
        style: {
          fontSize: '12px',
          fontWeight: '600',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Categories',
        style: {
          fontSize: '12px',
          fontWeight: '600',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
//      custom: function(opts: any) {
//        const desc =
//          opts.ctx.w.config.series[opts.seriesIndex].desc[opts.dataPointIndex]
//        return desc;
//      },
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
  };

  columnChart: any = {
    series: [
      {
        name: 'Project Count',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false,
      },
    },
    colors: ['#ffbb00'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '10%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 30,
      colors: ['transparent'],
    },

    xaxis: {
      categories: [],
      labels: {
        style: {
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: 'No. of projects',
        style: {
          fontSize: '12px',
          fontWeight: '600',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
  };

  constructor(private service: StatisticsService) {
    this.categoryLoadingSubject = new BehaviorSubject<boolean>(false);
    this.categoryLoading$ = this.categoryLoadingSubject.asObservable();
    this.userLoadingSubject = new BehaviorSubject<boolean>(false);
    this.userLoading$ = this.userLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.getProjectDateCount();
    this.getProjectCategoryCount();

  }

  getProjectDateCount() {
    const sub = this.service.findProjectDateCountByInvestor().subscribe(
      (data: any) => {
        data.forEach((val: any) => {
          if (val.projectMonth && val.projectYear) {
            this.columnChart.xaxis.categories.push(
              `${this.months[val.projectMonth]} ${val.projectYear}`
            );
            this.columnChart.series[0].data.push(val.projectCount);
          }
        });
      },
      (error) => {
        console.log('this is error========', error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectCategoryCount() {
    this.categoryLoadingSubject.next(true);
    const sub = this.service.findProjectCategoryCountByInvestor().subscribe(
      (data: any) => {
        this.categoryLoadingSubject.next(false);
        data.forEach((val: any) => {
        this.categoryChart.xaxis.categories.push(val.categoryNumber);
//        this.categoryChart.series[0].desc.push(val.projectCount);
        this.categoryChart.series[0].data.push(val.projectCount);
        //this.pieChart.labels.push(val.categoryName);
        //this.pieChart.series.push(val.projectCount);
        });
      },
      (error) => {
        this.categoryLoadingSubject.next(false);
      }
    );
    this.unsubscribe.push(sub);
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
