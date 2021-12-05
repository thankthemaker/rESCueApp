import {Component, Input, OnInit} from '@angular/core';
import {BatteryTypeComponent} from '../battery-type/battery-type.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
})
export class BatteryComponent implements OnInit {

  @Input() rescueConf: any;
  batteryPresets: any;

  constructor(private popoverController: PopoverController) {
    this.batteryPresets = {
      minVoltage: 40.0,
      maxVoltage: 50.4,
      lowVoltage: 42.0
    };
  }

  ngOnInit() {
  }

  async changeBatteryType(event) {
    const popover = await this.popoverController.create({
      //event,
      component: BatteryTypeComponent,
      translucent: true
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    this.rescueConf.batteryType = data.battery;
    this.batteryPresets = {
      minVoltage: (data.batteryCells * 3.3333).toFixed(1),
      maxVoltage: (data.batteryCells * 4.2).toFixed(1),
      lowVoltage: (data.batteryCells * 3.5).toFixed(1)
    };
    this.rescueConf.minBatteryVoltage = this.batteryPresets.minVoltage;
    this.rescueConf.lowBatteryVoltage = this.batteryPresets.lowVoltage;
    this.rescueConf.maxBatteryVoltage = this.batteryPresets.maxVoltage;
    console.log('Selected BatteryType: ' + this.rescueConf.batteryType);
    this.ngOnInit();
  }
}
