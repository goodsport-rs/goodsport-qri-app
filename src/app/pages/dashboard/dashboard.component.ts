import {Component, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/core/services/statistics.service';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

interface CardData {
  title: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cards: CardData[] = [];
  dataLoading$: Observable<boolean>;
  dataLoadingSubject: BehaviorSubject<boolean>;

  private unsubscribe: Subscription[] = [];
  constructor(private service: StatisticsService) {
    this.dataLoadingSubject = new BehaviorSubject<boolean>(false);
    this.dataLoading$ = this.dataLoadingSubject.asObservable();
  }

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
      height: 350,
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
      height: 350,
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
      width: 20,
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


  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    this.getUserStats();
    this.getProjectDateCount();
    this.getProjectCategoryCount();
  }

  getUserStats() {
    this.dataLoadingSubject.next(true);
    const sub = this.service.getUserStats().subscribe(

      (data: any) => {
        this.dataLoadingSubject.next(false);
        console.log('User stats received:', data);
        this.cards.push(
          {
            title: 'Total Users',
            value: data.totalEntrepreneur,
            description: 'Antal användare',
          },
          {
            title: 'Total Projects',
            value: data.totalProjects,
            description: 'Antal projekt',
          },
          {
            title: 'Total Participants',
            value: data.totalParticipants,
            description: 'Total deltagare',
          },
          {
            title: 'Total Investors',
            value: data.totalInvestors,
            description: 'Total antal investerare',
          }
        );
        console.log('Cards array after push:', this.cards);
      },
      (error) => {
        this.dataLoadingSubject.next(false);
        console.log('Error fetching user stats:', error);
      }
    );
    this.unsubscribe.push(sub);
  }

  getProjectDateCount() {
    const sub = this.service.findProjectDateCount().subscribe(
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
    this.dataLoadingSubject.next(true);
    const sub = this.service.findProjectCategoryCount().subscribe(
      (data: any) => {
        this.dataLoadingSubject.next(false);
        data.forEach((val: any) => {
          this.categoryChart.xaxis.categories.push(val.categoryNumber);
          this.categoryChart.series[0].data.push(val.projectCount);
        });
      },
      (error) => {
        this.dataLoadingSubject.next(false);
      }
    );
    this.unsubscribe.push(sub);
  }

}
