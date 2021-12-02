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

export type BatteryChartOptions = {
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
  selector: 'app-battery-chart',
  templateUrl: './battery-chart.component.html',
  styleUrls: ['./battery-chart.component.scss'],
})
export class BatteryChartComponent implements OnInit {

  @ViewChild('batteryChart') chart: ChartComponent;
  public showAsArea = false;
  public batteryChartOptions: Partial<BatteryChartOptions>;

  constructor() {
    this.buildBatteryChartOptions();
  }

  ngOnInit() {}

  buildBatteryChartOptions() {
    this.batteryChartOptions = {
      noData: {
        text: 'No data available yet'
      },
      title: {
        text: 'Battery',
        align: 'center'
      },
      series: [
        {
          name: 'Voltage',
          type: this.showAsArea ? 'area' : 'line',
          data: [],
          color: '#00E396'
        },
        {
          name: 'Amp Hours',
          type: 'line',
          data: [],
          color: '#008FFB'
        },
        {
          name: 'Watt Hours',
          type: 'line',
          data: [],
          color: '#FEB019'
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
        type: 'datetime'
      },
      yaxis: [
        {
          seriesName: 'Voltage',
          title: {
            text: 'Voltage',
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
          seriesName: 'Amp Hours',
          title: {
            text: 'Amp Hours',
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
        {
          opposite: true,
          seriesName: 'Watt Hours',
          title: {
            text: 'Watt Hours',
            style: {
              color: '#FEB019'
            }
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019'
          },
          labels: {
            style: {
              colors: '#FEB019'
            }
          }
        }
      ],
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    };
  }
}
