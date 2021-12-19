import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent implements OnInit {

  locked = true;
  @Input() rescueConf: any;
  @Output() changeEvent = new EventEmitter<{ key: string, value: string }>();

  constructor(
    private logger: NGXLogger) {}

  ngOnInit() {
  }

  changeBatteryWarningSoundIndex(event) {
    this.rescueConf.batteryWarningSoundIndex = event.detail.value;
    if(!this.locked) {
      this.changeEvent.emit({key: 'batteryWarningSoundIndex', value: event.detail.value});
    }
  }

  changeBatteryAlarmSoundIndex(event) {
    this.rescueConf.batteryAlarmSoundIndex = event.detail.value;
    if(!this.locked) {
      this.changeEvent.emit({key: 'batteryAlarmSoundIndex', value: event.detail.value});
    }
  }

  changeStartSoundIndex(event) {
    this.rescueConf.startSoundIndex = event.detail.value;
    if(!this.locked) {
      this.changeEvent.emit({key: 'startSoundIndex', value: event.detail.value});
    }
  }

  lock() {
    this.logger.debug('lock');
    this.locked = true;
  }

  unlock() {
    this.logger.debug('unlock');
    this.locked = false;
  }
}
