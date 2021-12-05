import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BatteryGaugeComponent} from '../charts/battery-gauge/battery-gauge.component';
import {DualGaugeComponent} from '../charts/dual-gauge/dual-gauge.component';
import {RidingChartComponent} from '../charts/riding-chart/riding-chart.component';
import {BatteryChartComponent} from '../charts/battery-chart/battery-chart.component';
import {TemperatureChartComponent} from '../charts/temperature-chart/temperature-chart.component';
import {RescueData} from '../RescueData';

@Component({
  selector: 'app-livedata',
  templateUrl: './livedata.page.html',
  styleUrls: ['./livedata.page.scss'],
})
export class LivedataPage implements OnInit, OnDestroy {

  @ViewChild(BatteryGaugeComponent)
  batteryGauge: BatteryGaugeComponent;
  @ViewChild(DualGaugeComponent)
  dualGauge: DualGaugeComponent;
  @ViewChild(RidingChartComponent)
  ridingChart: RidingChartComponent;
  @ViewChild(BatteryChartComponent)
  batteryChart: BatteryChartComponent;
  @ViewChild(TemperatureChartComponent)
  temperatureChart: TemperatureChartComponent;
  showAsArea = false;
  timerId: any;

  constructor(private rescueData: RescueData) {}

  ngOnInit() {

    this.timerId = setInterval(() => {
      this.update();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  update() {
    const bat = Math.trunc(((this.rescueData.battery*100.00 - 4000) / (5040-4000) * 100.00)) ;
    console.log('battery: ' + bat);

    const now = new Date().toISOString();

    this.batteryChart.chart.appendData(
    [
      { data: [ { y: this.rescueData.battery, x: now }] },
      { data: [ { y: this.rescueData.wattHours, x: now }] },
      { data: [ { y: this.rescueData.ampHours, x: now }] }
    ]);

    this.temperatureChart.chart.appendData(
     [
       { data: [ { y: this.rescueData.motTemp, x: now }] },
       { data: [ { y: this.rescueData.fetTemp, x: now }] }
     ]);

    this.ridingChart.chart.appendData(
      [
        { data: [ { y: this.rescueData.erpm, x: now }] },
        { data: [ { y: this.rescueData.dutyCycle, x: now }] },
      ]
    );

    this.batteryGauge.batteryGaugeOptions.series=[bat];
    this.dualGauge.dualGaugeOptions.series = [(this.rescueData.erpm * 100) / 10000, this.rescueData.dutyCycle, this.rescueData.battery];
    let image = '../../assets/100percent.png';
    if(bat >= 80) {
      image = '../../assets/100percent.png';
    } else if(bat >= 60 && bat < 80) {
      image = '../../assets/80percent.png';
    } else if(bat >= 40 && bat < 60) {
      image = '../../assets/60percent.png';
    } else if(bat >= 20 && bat < 40) {
      image = '../../assets/40percent.png';
    } else if(bat >= 0) {
      image = '../../assets/20percent.png';
    }

    this.batteryGauge.batteryGaugeOptions.plotOptions = {
      radialBar: {
        hollow: {
          margin: 15,
            size: '70%',
            image,
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
    };
  }

  toggleArea() {
    this.showAsArea = !this.showAsArea;
    this.ridingChart.showAsArea = this.showAsArea;
    this.batteryChart.showAsArea = this.showAsArea;
    this.temperatureChart.showAsArea = this.showAsArea;
    this.ridingChart.buildRidingChartOptions();
    this.batteryChart.buildBatteryChartOptions();
    this.temperatureChart.buildTemperatureChartOptions();
  }
}
