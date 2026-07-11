import {Component, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/core/services/statistics.service';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

interface CardData {
  title: string;
  value: number;
  description: string;
  icon: string;
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
        name: 'Projects',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 340,
      fontFamily: 'Inter, Helvetica, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: ['#c91523'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#ffffff'],
        fontWeight: 700,
        fontSize: '12px',
      },
      offsetX: -6,
    },
    grid: {
      borderColor: '#eef0f3',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: [],
      title: {
        text: 'No. of projects',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
          colors: '#6b7280',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Categories',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
          colors: '#111318',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: 'light',
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
        name: 'Projects',
        data: [],
      },
    ],
    chart: {
      type: 'area',
      height: 340,
      fontFamily: 'Inter, Helvetica, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: ['#c91523'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#c91523'],
    },
    markers: {
      size: 0,
      colors: ['#c91523'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: { size: 6 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: '#eef0f3',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontWeight: 600,
          colors: '#6b7280',
        },
      },
    },
    yaxis: {
      title: {
        text: 'No. of projects',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
        },
      },
      labels: {
        style: {
          fontWeight: 600,
          colors: '#6b7280',
        },
      },
    },
    tooltip: {
      theme: 'light',
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
            icon: 'bi-people-fill',
          },
          {
            title: 'Total Projects',
            value: data.totalProjects,
            description: 'Antal projekt',
            icon: 'bi-kanban-fill',
          },
          {
            title: 'Total Participants',
            value: data.totalParticipants,
            description: 'Total deltagare',
            icon: 'bi-person-check-fill',
          },
          {
            title: 'Total Investors',
            value: data.totalInvestors,
            description: 'Total antal investerare',
            icon: 'bi-graph-up-arrow',
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
