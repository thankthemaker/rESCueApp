import {Component, OnInit, ViewChild} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexNoData,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis, ChartComponent
} from 'ng-apexcharts';

export type RidingChartOptions = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  noData: ApexNoData;
};

@Component({
  selector: 'app-riding-chart',
  templateUrl: './riding-chart.component.html',
  styleUrls: ['./riding-chart.component.scss'],
})
export class RidingChartComponent implements OnInit {

  @ViewChild('rideChart') chart: ChartComponent;
  public showAsArea = false;
  public ridingChartOptions: Partial<RidingChartOptions>;

  constructor() {
    this.buildRidingChartOptions();
  }

  ngOnInit() {}

  buildRidingChartOptions() {
    this.ridingChartOptions = {
      noData: {
        text: 'No data available yet'
      },
      title: {
        text: 'Riding',
        align: 'center'
      },
      series: [
        {
          name: 'ERPM',
          data: [],
          color: '#00E396'
        },
        {
          name: 'Duty Cycle',
          data: [],
          color: '#008FFB'
        }
      ],
      chart: {
        height: 250,
        type: this.showAsArea ? 'area' : 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: [
        {
          seriesName: 'ERPM',
          title: {
            text: 'ERPM',
            style: {
              color: '#00E396',
            }
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            style: {
              colors: '#00E396'
            },
          }
        },
        {
          opposite: true,
          seriesName: 'Duty Cycle',
          title: {
            text: 'Duty Cycle',
            style: {
              color: '#008FFB'
            }
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            style: {
              colors: '#008FFB',
            }
          }
        },
      ],
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    };
  }
}
