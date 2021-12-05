import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-battery-type',
  templateUrl: './battery-type.component.html',
  styleUrls: ['./battery-type.component.scss'],
})
export class BatteryTypeComponent implements OnInit {

  battery: string;
  batteryCells: number;
  batteryGroups: number;
  cellCapacity: number;

  constructor(private popover: PopoverController) {
    this.batteryCells = 12;
    this.batteryGroups = 2;
    this.cellCapacity = 3000;
  }

  ngOnInit() {
  }

  close() {
    this.popover.dismiss({
      battery: this.battery,
      batteryCells: this.batteryCells,
      batteryGroups: this.batteryGroups,
      cellCapacity: this.cellCapacity
    });
  }

  changeCellCount(event) {
    this.batteryCells = event.detail.value;
    this.changeBattery();
  }

  changeGroupCount(event) {
    this.batteryGroups = event.detail.value;
    this.changeBattery();
  }

  changeCapacity(event) {
    this.cellCapacity = event.detail.value;
    this.changeBattery();
  }

  changeBattery() {
    this.battery = this.batteryCells + 's' + this.batteryGroups + 'p ' + this.batteryGroups*this.cellCapacity / 1000 + 'Ah';
  }
}
