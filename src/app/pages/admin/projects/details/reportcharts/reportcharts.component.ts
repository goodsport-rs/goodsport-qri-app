import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import {ProjectService} from 'src/app/core/services/project.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type columnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-reportcharts',
  templateUrl: './reportcharts.component.html',
  styleUrls: ['./reportcharts.component.scss']
})
export class ReportchartsComponent implements OnInit {

  @ViewChild("chart", {static: false}) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  projectId: any;
  show1: boolean = false;
  show2: boolean = false;
  noColData: boolean;
  noPieData: boolean;


  localityStatChart: any = {
    series: [
      {
        name: 'Antal deltagare',
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
        text: 'Deltagare',
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
        text: 'Orter',
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

  constructor(private service: ProjectService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.id;


    this.getDateStats();
    this.getLocalityStats();
  }

  getDateStats() {
    this.show2 = true;
    this.service.getDateStats(this.projectId).subscribe((val: any) => {
      this.show2 = false;
      if (val && val.length) {
        this.noPieData = false;
        this.buildPieChart(val);
      } else {
        this.noPieData = true;
      }
    }, (err) => {
      this.show2 = false;
      this.noPieData = true;
    });
  }


  buildPieChart(data: any) {
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ['Males', 'Females', 'Leaders'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    let m = 0, f = 0, p = 0;
    data.forEach((val: any) => {
      m = m + val.maleParticipants;
      f = f + val.femaleParticipants;
      p = p + val.leaders;
    })
    this.chartOptions.series.push(m);
    this.chartOptions.series.push(f);
    this.chartOptions.series.push(p);
  }


  getLocalityStats() {
    this.show1 = true;
    this.service.getLocalityStats(this.projectId).subscribe((data: any) => {
      this.show1 = false;
      data.forEach((val: any) => {
        this.localityStatChart.xaxis.categories.push(val.locality);
        this.localityStatChart.series[0].data.push(val.femaleParticipants+val.maleParticipants+val.leaders);

      });
    }, (err) => {
      this.show1 = false;
      this.noColData = true;
    });
  }


}
