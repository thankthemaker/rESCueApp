import {Component} from '@angular/core';
import {AppSettings} from '../../models/AppSettings';
import {NotificationsService} from "../../services/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {

  constructor(
    public appSettings: AppSettings,
    private notificationService: NotificationsService
    ) {}

  sendNotification() {
    this.notificationService.push("I'm sorry", "Not yet implemented!");
  }
}
