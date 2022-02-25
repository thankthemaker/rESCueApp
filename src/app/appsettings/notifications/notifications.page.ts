import {Component, Input, OnInit} from '@angular/core';
import {AppSettings} from '../../models/AppSettings';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(
    public appSettings: AppSettings) {}

  ngOnInit() {}
}
