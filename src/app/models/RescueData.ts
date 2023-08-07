import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RescueData {

  uuid = "";
  firmware = "";
  speed = 0;
  tachometer = 0;
  tachometerAbs = 0;
  erpm = 0;
  current = 0;
  dutyCycle = 0;
  battery = 0;
  batteryLevel = 0;
  wattHours = 0;
  ampHours = 0;
  motTemp = 0;
  fetTemp = 0;
  faultCode = 0;
  loopCount = 0;
  avgLoopTime = 0;
  maxLoopTime = 0;

  constructor() {}

}
