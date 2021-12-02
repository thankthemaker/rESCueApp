import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RescueData {

  tachometer = 0;
  erpm = 0;
  current = 0;
  dutyCycle = 50;
  battery = 45.9;
  wattHours = 0;
  ampHours = 0;
  motTemp = 21;
  fetTemp = 30;
  loopTime = 0;
  maxLoopTime = 0;

  constructor() {}

}
