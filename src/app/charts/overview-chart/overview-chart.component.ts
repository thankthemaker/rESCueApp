import {Component, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import {AppSettings} from '../../models/AppSettings';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
})
export class OverviewChartComponent implements OnInit {
  isHighcharts = typeof Highcharts === 'object';

  speedGaugeChart: typeof Highcharts = Highcharts;
  dutyGaugeChart: typeof Highcharts = Highcharts;
  erpmGaugeChart: typeof Highcharts = Highcharts;
  currentGaugeChart: typeof Highcharts = Highcharts;
  batteryGaugeChart: typeof Highcharts = Highcharts;

  public speedGaugeOptions: Highcharts.Options;
  public dutyGaugeOptions: Highcharts.Options;
  public erpmGaugeOptions: Highcharts.Options;
  public currentGaugeOptions: Highcharts.Options;
  public batteryGaugeOptions: Highcharts.Options;

  speedUpdateFlag = false;
  dutyUpdateFlag = false;
  currentUpdateFlag = false;
  batteryUpdateFlag = false;
  erpmUpdateFlag = false;

  gaugeOptions: Highcharts.Options = {
    chart: {
      type: 'gauge',
      width: 165,
      height: 165,
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      backgroundColor: 'transparent'
    },
    title: null,
    credits: {
      enabled: false,
    },
    pane: {
      size: '85%',
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },
    // the value axis
    yAxis: {
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        //rotation: 'auto'
      },
    },
    plotOptions: {
      series: {
        animation: false
      },
      gauge: {
        dataLabels: {
          y: 90,
          x: -1,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  solidGaugeOptions: Highcharts.Options = {
    chart: {
      type: 'solidgauge',
      height: 110,
      width: 110,
      margin: [0, 0, 40, 0],
      spacingBottom: 0,
      spacingTop: 0,
      spacingLeft: 5,
      spacingRight: 5,
      backgroundColor: 'transparent',
    },
    title: null,
    credits: {
      enabled: false,
    },
    pane: {
      center: ['50%', '85%'],
      size: '100%',
      startAngle: -70,
      endAngle: 70,
      background: [
        {
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      ]
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      stops: [
        [0.1, '#55BF3B'], // green
        [0.49, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.69, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 14,
        distance: 2
      }
    },
    plotOptions: {
      series: {
        animation: false
      },
      solidgauge: {
        dataLabels: {
            y: 14,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  constructor(private appSettings: AppSettings) {
    const speedUnit = appSettings.metricSystemEnabled ? 'km/h' : 'mph';
    const speeds = appSettings.metricSystemEnabled ? [0, 14, 24, 30] : [0, 8, 15, 20];

    const batteryMin = appSettings.minVoltage;
    const batteryLow = appSettings.lowVoltage;
    const batteryMax = appSettings.maxVoltage;

    console.log(`min ${batteryMin}, low ${batteryLow}, max ${batteryMax}`);

    this.speedGaugeOptions = Highcharts.merge(this.gaugeOptions, {
      yAxis: {
        min: speeds[0],
        max: speeds[3],
        title: {
          y: 20,
          text: speedUnit
        },
        plotBands: [{
          from: speeds[0],
          to: speeds[1],
          color: '#55BF3B' // green
        }, {
          from: speeds[1],
          to: speeds[2],
          color: '#DDDF0D' // yellow
        }, {
          from: speeds[2],
          to: speeds[3],
          color: '#DF5353' // red
        }]
      },
      series: [{
        type: 'gauge',
        name: 'Speed',
        data: [0],
        dataLabels: {
          color: '#777777',
          format:
            '<div class="gauge-data-label" style="text-align:center">' +
            '<span style="font-size:16px">{y:.1f}<br/></span>' +
            '<span style="font-size:10px;opacity:0.4">&nbsp;</span>' +
            '</div>'
        },      tooltip: {
          valueSuffix: ' ' + speedUnit
        }
      }]
    });

    this.dutyGaugeOptions = Highcharts.merge(this.gaugeOptions, {
      yAxis: {
        min: 0,
        max: 100,
        title: {
          y: 20,
          text: '%'
        },
        plotBands: [{
          from: 0,
          to: 60,
          color: '#55BF3B' // green
        }, {
          from: 60,
          to: 80,
          color: '#DDDF0D' // yellow
        }, {
          from: 80,
          to: 100,
          color: '#DF5353' // red
        }]
      },
      series: [{
        type: 'gauge',
        name: 'DutyCycle',
        data: [0],
        dataLabels: {
          color: '#777777',
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:16px">{y:.0f}<br/></span>' +
            '<span style="font-size:10px;opacity:0.4">&nbsp;</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' %'
        }
      }]
    });

    this.erpmGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        min: 0,
        max: 100000,
        labels: {
          style: {
            color: '#777777'
          }
        },
       plotBands: [
          { from: 0, to: 60000, color: 'green', outerRadius: '38', innerRadius: '35'},
          { from: 60000, to: 80000, color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: 80000, to: 100000, color: 'red', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'ERPM',
        data: [0],
        dataLabels: {
          color: '#777777',
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4"><br/></span>' +
            '<span style="font-size:14px">{y}</span>' +
            '</div>'
        },
      }]
    });

    this.batteryGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        type: 'numeric',
        min: Math.round(batteryMin),
        max: Math.round(batteryMax),
        labels: {
          style: {
            color: '#777777'
          }
        },
        tickPositions: [Math.round(batteryMin), Math.round(batteryMax)],
        stops: [
          [0.1, '#DF5353'], // red
          //[0.24, '#DF5353'], // red
          [0.24, '#DDDF0D'], // yellow
          //[0.48, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'] // green
        ],
        plotBands: [
          { from: Math.round(batteryMin), to: Math.round(batteryLow), color: 'red', outerRadius: '38', innerRadius: '35'},
          { from: Math.round(batteryLow), to: Math.round(batteryLow + (batteryLow * 5/100)) , color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: Math.round(batteryLow + (batteryLow * 5/100)), to: Math.round(batteryMax), color: 'green', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'Battery',
        data: [0],
        dataLabels: {
          color: '#777777',
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4;color:#FFFFFF">V<br/></span>' +
            '<span style="font-size:14px">{y:.1f}</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' V'
        }
      }]
    });

    this.currentGaugeOptions = Highcharts.merge(this.solidGaugeOptions, {
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          style: {
            color: '#777777'
          }
        },
       plotBands: [
          { from: 0, to: 50, color: 'green', outerRadius: '38', innerRadius: '35'},
          { from: 50, to: 70, color: 'yellow', outerRadius: '38', innerRadius: '35'},
          { from: 70, to: 100, color: 'red', outerRadius: '38', innerRadius: '35'},
        ]
      },
      series: [{
        type: 'solidgauge',
        name: 'Current',
        data: [0],
        dataLabels: {
          color: '#777777',
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:10px;opacity:0.4;color:#FFFFFF">A<br/></span>' +
            '<span style="font-size:14px">{y:.1f}</span>' +
            '</div>'
        },
        tooltip: {
          valueSuffix: ' %'
        }
      }]
    });
  }

  ngOnInit() {}

  scale(val, inMin, inMax, outMin, outMax) {
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  updateSpeed(speedData) {
    if(this.speedGaugeOptions.series[0]['data'][0] !== speedData) {
      this.speedGaugeOptions.series[0]['data'] = [ speedData ]
      this.speedUpdateFlag = true;
    }
  }

  updateDuty(dutyData) {
    if(this.dutyGaugeOptions.series[0]['data'][0] !== dutyData) {
      this.dutyGaugeOptions.series[0]['data'] = [ dutyData ]
      this.dutyUpdateFlag = true;
    }
  }

  updateBattery(batteryData) {
    if(this.batteryGaugeOptions.series[0]['data'][0] !== batteryData) {
      this.batteryGaugeOptions.series[0]['data'] = [ batteryData ]
      this.batteryUpdateFlag = true;
    }
  }

  updateCurrent(currentData) {
    if(this.currentGaugeOptions.series[0]['data'][0] !== currentData) {
      this.currentGaugeOptions.series[0]['data'] = [ currentData ]
      this.currentUpdateFlag = true;
    }
  }

  updateErpm(erpmData) {
    if(this.erpmGaugeOptions.series[0]['data'][0] !== erpmData) {
      this.erpmGaugeOptions.series[0]['data'] = [ erpmData ]
      this.erpmUpdateFlag = true;
    }
  }
}
