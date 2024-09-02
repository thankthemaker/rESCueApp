import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-canbus',
  templateUrl: './canbus.component.html',
  styleUrls: ['./canbus.component.scss'],
})
export class CanbusComponent implements OnInit {

  @Input() rescueConf: any;

  constructor() { }

  ngOnInit() {}

  changeVescId(event) {
    this.rescueConf.vescId = event.detail.vescId;
  }

  changeRealtimeDataInterval(event) {
    this.rescueConf.realtimeDataInterval = event.detail.value;
  }

  changeBalanceDataInterval(event) {
    this.rescueConf.balanceDataInterval = event.detail.value;
  }
}
