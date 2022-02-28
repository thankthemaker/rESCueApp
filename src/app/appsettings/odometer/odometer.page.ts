import { Component, OnInit } from '@angular/core';
import {AppSettings} from '../../models/AppSettings';

@Component({
  selector: 'app-odometer',
  templateUrl: './odometer.page.html',
  styleUrls: ['./odometer.page.scss'],
})
export class OdometerPage implements OnInit {

  constructor(
    public appSettings: AppSettings) {}

  ngOnInit() {
  }

}
