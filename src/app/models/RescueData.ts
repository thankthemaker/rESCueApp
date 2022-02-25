import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RescueData {

  tachometer = 0;
  erpm = 0;
  current = 0;
  dutyCycle = 0;
  battery = 0;
  wattHours = 0;
  ampHours = 0;
  motTemp = 0;
  fetTemp = 0;
  faultCode = 0;
  loopTime = 0;
  maxLoopTime = 0;

  constructor() {}

}
