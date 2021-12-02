import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {BleService} from '../services/ble.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage implements OnInit {

  @ViewChild('wizard', { static: false }) wizard: IonSlides;

  connected: boolean;
  deviceId: string;
  deviceName: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
    private router: Router,
    private bleService: BleService) {
    this.connected = false;
    this.deviceName = '';
    this.deviceId = '';
  }

  ngOnInit() {
  }

  async scan() {
    const success = await this.bleService.connect(false);
    if (success) {
      this.deviceName = this.bleService.device.name;
      this.deviceId = this.bleService.device.deviceId;
      this.connected = true;
      this.wizard.slideNext(500);
    }
  }

  skipWizard() {
    localStorage.setItem('deactivateWizard', String(true));
    this.router.navigate(['/home']);
  }

  endWizard() {
    localStorage.setItem('deactivateWizard', String(true));
    this.router.navigate(['/device']);
  }

  goBack() {
    this.wizard.slideTo(0, 500);
  }

  slideChanged() {
    if(!this.connected) {
      this.wizard.getActiveIndex().then((index) => {
        if(index > 1) {
          this.wizard.slideTo(1, 50);
        }
      });
    }
  }
}
