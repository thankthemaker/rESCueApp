import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent implements OnInit {

  @Input() rescueConf: any;

  constructor() { }

  ngOnInit() {}

  changeBatteryWarningSoundIndex(event) {
    this.rescueConf.batteryWarningSoundIndex= event.detail.value;
    //this.saveProperty('batteryWarningSoundIndex', String(this.rescueConf.batteryWarningSoundIndex));
  }

  changeBatteryAlarmSoundIndex(event) {
    this.rescueConf.batteryAlarmSoundIndex= event.detail.value;
    //this.saveProperty('batteryAlarmSoundIndex', String(this.rescueConf.batteryAlarmSoundIndex));
  }

  changeStartSoundIndex(event) {
    this.rescueConf.startSoundIndex= event.detail.value;
    //this.saveProperty('startSoundIndex', String(this.rescueConf.startSoundIndex));
  }
}
