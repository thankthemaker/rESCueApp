import {Component, OnInit} from '@angular/core';
import {AppSettings} from '../../models/AppSettings';
import {NotificationsService} from "../../services/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(
    public appSettings: AppSettings,
    private notificationService: NotificationsService
    ) {}

  ngOnInit() {
  }

  sendNotification() {
    this.notificationService.push("I'm sorry", "Not yet implemented!");
  }
}
