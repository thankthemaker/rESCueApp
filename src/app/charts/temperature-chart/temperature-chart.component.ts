import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexNoData,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis, ChartComponent
} from "ng-apexcharts";

export type TemperatureChartOptions = {
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
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.scss'],
})
export class TemperatureChartComponent implements OnInit {

  @ViewChild('tempChart') chart: ChartComponent;
  public showAsArea = false;
  public temperatureChartOptions: Partial<TemperatureChartOptions>;

  constructor() {
    this.buildTemperatureChartOptions();
  }

  ngOnInit() {}

  buildTemperatureChartOptions() {
    this.temperatureChartOptions = {
      noData: {
        text: 'No data available yet'
      },
      title: {
        text: 'Temperatures',
        align: 'center'
      },
      series: [
        {
          name: 'MOSFET',
          type: this.showAsArea ? 'area' : 'line',
          data: [],
          color: '#00E396'
        },
        {
          name: 'Motor',
          type: this.showAsArea ? 'area' : 'line',
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
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      yaxis: [
        {
          title: {
            text: "Temperature",
            style: {
              color: '#808289',
            }
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#808289'
          },
          labels: {
            style: {
              colors: '#808289'
            },
          }
        }
      ],
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }
}
