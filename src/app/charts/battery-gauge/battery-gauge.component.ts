import {Component, OnInit, ViewChild} from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke, ApexResponsive
} from 'ng-apexcharts';

export type GaugeOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-battery-gauge',
  templateUrl: './battery-gauge.component.html',
  styleUrls: ['./battery-gauge.component.scss'],
})
export class BatteryGaugeComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;
  public batteryGaugeOptions: Partial<GaugeOptions>;

  constructor() {
    this.buildGaugeOptions();
  }

  ngOnInit() {
  }

  buildGaugeOptions() {
    this.batteryGaugeOptions = {
      series: [40],
      chart: {
        type: 'radialBar',
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: '70%',
            image: '../../assets/40percent.png',
            imageWidth: 64,
            imageHeight: 64,
            imageClipped: false
          },
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: (val) => {
                return val + '%';
              }
            }
          }
        }
      },
      fill: {
        colors: [({value, seriesIndex, w}) => {
          if (value < 25) {
            return '#C0392B';
          } else if (value >= 25 && value < 75) {
            return '#F1C40F';
          } else {
            return '#229954';
          }
        }],
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        }
      },
      stroke: {
        dashArray: 4
      },
      labels: ['Battery'],
      responsive: [
        {
          breakpoint: 550,
          options: {
            chart: {
              height: 240
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    offsetY: 55,
                    fontSize: '16px'
                  }
                }
              }
            },
            legend: {
              show: false
            }
          }
        }, {
          breakpoint: 500,
          options: {
            chart: {
              height: 190
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    offsetY: 55,
                    fontSize: '16px'
                  }
                }
              }
            },
            legend: {
              show: false
            }
          }
        },
        {
          breakpoint: 460,
          options: {
            chart: {
              height: 140
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    offsetY: 55,
                    fontSize: '16px'
                  }
                }
              }
            },
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
}
