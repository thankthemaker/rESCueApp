import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';
import {BatteryGaugeComponent} from '../charts/battery-gauge/battery-gauge.component';
import {DualGaugeComponent} from '../charts/dual-gauge/dual-gauge.component';
import {RidingChartComponent} from '../charts/riding-chart/riding-chart.component';
import {BatteryChartComponent} from '../charts/battery-chart/battery-chart.component';
import {TemperatureChartComponent} from '../charts/temperature-chart/temperature-chart.component';
import {RescueData} from '../models/RescueData';
import {ListpickerComponent} from '../components/listpicker/listpicker.component';
import {NGXLogger} from 'ngx-logger';
import {MapComponent} from '../components/map/map.component';
import {StorageService} from "../services/storage.service";
import {KeysResult} from "@capacitor/storage";

@Component({
  selector: 'app-livedata',
  templateUrl: './livedata.page.html',
  styleUrls: ['./livedata.page.scss'],
})
export class LivedataPage implements OnInit, OnDestroy {

  @ViewChild(MapComponent)
  map: MapComponent;
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
  rideId: string;
  rides: string[];
  liveDataActive = false;
  google: any;
  geoOptions : PositionOptions;

  constructor(
    private popupController: PopoverController,
    private loadingController: LoadingController,
    private storageService: StorageService,
    public rescueData: RescueData,
    private logger: NGXLogger) {
  }

  ngOnInit() {
    this.rideId = new Date().toISOString();
    this.startLiveData();
  }

  ngOnDestroy() {
    this.stopLiveData();
  }

  update() {
    const bat = this.rescueData.batteryLevel;
    this.logger.debug('battery: ' + bat);

    const now = new Date().toISOString();

    this.batteryChart.chart.appendData(
      [
        {data: [{y: this.rescueData.battery, x: now}]},
        {data: [{y: this.rescueData.wattHours, x: now}]},
        {data: [{y: this.rescueData.ampHours, x: now}]}
      ]);

    this.temperatureChart.chart.appendData(
      [
        {data: [{y: this.rescueData.fetTemp, x: now}]},
        {data: [{y: this.rescueData.motTemp, x: now}]}
      ]);

    this.ridingChart.chart.appendData(
      [
        {data: [{y: this.rescueData.erpm.toFixed(0), x: now}]},
        {data: [{y: this.rescueData.dutyCycle.toFixed(0), x: now}]},
      ]
    );

    this.dualGauge.dualGaugeOptions.series = [(this.rescueData.erpm * 100) / 10000, this.rescueData.dutyCycle, this.rescueData.batteryLevel];

    this.batteryGauge.batteryGaugeOptions.series = [bat];
    const oldImage = this.batteryGauge.chart.plotOptions.radialBar.hollow.image;
    let newImage = '../../assets/100percent.png';
    if (bat >= 80) {
      newImage = '../../assets/100percent.png';
    } else if (bat >= 60 && bat < 80) {
      newImage = '../../assets/80percent.png';
    } else if (bat >= 40 && bat < 60) {
      newImage = '../../assets/60percent.png';
    } else if (bat >= 20 && bat < 40) {
      newImage = '../../assets/40percent.png';
    } else if (bat >= 0) {
      newImage = '../../assets/20percent.png';
    }
    ;

    if (oldImage !== newImage) {
      this.batteryGauge.batteryGaugeOptions.plotOptions = {
        radialBar: {
          hollow: {
            margin: 15,
            size: '70%',
            image: newImage,
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
    this.map.infowindow.setContent(`<div id="content"><b>Trip:</b> ${this.rescueData.tachometer}</div>`);
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

  async listData() {
    const keys: KeysResult = await this.storageService.keys();
    this.rides = keys.keys.filter((key) => key.startsWith('ride-'));

    const popover = await this.popupController.create({
      component: ListpickerComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        title: 'Select ride',
        items: this.rides
      },
      translucent: true
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    if (data !== undefined) {
      this.logger.info('Chosen ride: ' + data);
      await this.loadData(data);
    }
  }

  async loadData(name: string) {
    const loading = await this.loadingController.create({
      message: 'Loading ride: ' + name,
      spinner: 'bubbles',
      duration: 5000
    });
    await loading.present();

    this.stopLiveData();
    this.clearData();
    const ride = JSON.parse(await this.storageService.get(name));
    this.batteryChart.chart.series = ride.batteryData;
    this.batteryChart.chart.appendData(
      [
        {data: ride.batteryData[0].data},
        {data: ride.batteryData[1].data},
        {data: ride.batteryData[2].data}
      ]);
    this.temperatureChart.chart.appendData(
      [
        {data: ride.temperatureDate[0].data},
        {data: ride.temperatureDate[1].data}
      ]
    );
    this.ridingChart.chart.appendData(
      [
        {data: ride.ridingData[0].data},
        {data: ride.ridingData[1].data}
      ]
    );
    this.map.currentWaypoints = ride.wayPoints;
    this.map.currentTrack.setMap(this.map.map);
    await loading.dismiss();
    this.logger.info('Loaded ride ' + name);
  }

  async saveData() {
    const name = 'ride-' + this.rideId;
    const ride = {
      name,
      temperatureDate: this.temperatureChart.chart.series,
      batteryData: this.batteryChart.chart.series,
      ridingData: this.ridingChart.chart.series,
      wayPoints: this.map.currentWaypoints,
    };
    await this.storageService.set(name, JSON.stringify(ride));
  }

  async clearData() {
    this.batteryChart.chart.updateSeries([
      {data: []},
      {data: []},
      {data: []}
    ]);
    this.temperatureChart.chart.updateSeries([
      {data: []},
      {data: []}
    ]);
    this.ridingChart.chart.updateSeries([
      {data: []},
      {data: []}
    ]);
    this.map.currentTrack.setMap(null);
    this.map.currentWaypoints = [];
  }

  async startLiveData() {
    if (!this.liveDataActive) {
      this.liveDataActive = true;
      this.timerId = setInterval(() => {
        this.update();
      }, 1000);
    }
    this.map.addWatch();
  }

  async stopLiveData() {
    if (this.timerId && this.liveDataActive) {
      clearInterval(this.timerId);
      this.liveDataActive = false;
    }
    this.map.stopWatch();
  }
}
