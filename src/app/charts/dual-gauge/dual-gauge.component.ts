import {Component, OnInit, ViewChild} from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from 'ng-apexcharts';

export type GaugeOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
};

const erpmMax = 10000;
const legendNormal: ApexLegend = {
  show: true,
  floating: true,
  fontSize: '14px',
  position: 'left',
  offsetX: -10,
  offsetY: 10,
  labels: {
    useSeriesColors: true
  },
  formatter: (seriesName, opts) => {
    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
  },
  itemMargin: {
    horizontal: 3
  },
  markers: {
    width: 6,
    height: 6,
    offsetX: 0,
    offsetY: -1
  }
};

const legendSmall: ApexLegend = {
  show: true,
  floating: true,
  fontSize: '12px',
  position: 'left',
  offsetX: -4,
  offsetY: -10,
  labels: {
    useSeriesColors: true
  },
  formatter: (seriesName, opts) => {
    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
  },
  itemMargin: {
    horizontal: 3
  },
  markers: {
    width: 6,
    height: 6,
    offsetX: 0,
    offsetY: -1
  }
};
const legendMini: ApexLegend = {
  show: true,
  floating: true,
  fontSize: '10px',
  position: 'left',
  offsetX: -42,
  offsetY: -20,
  labels: {
    useSeriesColors: true
  },
  formatter: (seriesName, opts) => {
    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
  },
  itemMargin: {
    horizontal: 3,
    vertical: 0
  },
  markers: {
    width: 6,
    height: 6,
    offsetX: 0,
    offsetY: -1
  }
};


@Component({
  selector: 'app-dual-gauge',
  templateUrl: './dual-gauge.component.html',
  styleUrls: ['./dual-gauge.component.scss'],
})
export class DualGaugeComponent implements OnInit {

  @ViewChild('dualGauge') chart: ChartComponent;
  public dualGaugeOptions: Partial<GaugeOptions>;
  public erpm = 0;
  public dutyCycle = 50;
  public battery = 45.9;

  constructor() {
    this.buildGaugeOptions();
  }

  ngOnInit() {}

  buildGaugeOptions() {
    this.dualGaugeOptions = {
      series: [0, 0, 0],
      chart: {
        height: 240,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      labels: ['ERPM', 'DutyCycle', 'Battery'],
      legend: legendNormal,
      responsive: [
        {
          breakpoint: 550,
          options: {
            chart: {
              height: 240
            },
            legend: legendNormal
          }
        }, {
          breakpoint: 500,
          options: {
            chart: {
              height: 190
            },
            legend: legendSmall
          }
        },
        {
          breakpoint: 460,
          options: {
            chart: {
              height: 140
            },
            legend: legendMini
          }
        }
      ]
    };
  }
}
