import { Component } from '@angular/core';
import {AppSettings} from '../../models/AppSettings';

@Component({
  selector: 'app-odometer',
  templateUrl: './odometer.page.html',
  styleUrls: ['./odometer.page.scss'],
})
export class OdometerPage  {

  constructor(
    public appSettings: AppSettings) {}
}
