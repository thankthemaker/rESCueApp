import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LoadingController, PopoverController} from '@ionic/angular';
import {BleService} from '../services/ble.service';
import {LightsComponent} from './lights/lights.component';
import {AppSettings} from '../models/AppSettings';
import {NGXLogger} from 'ngx-logger';
import {TextinputComponent} from '../components/textinput/textinput.component';
import {RescueConf} from '../models/RescueConf';
import {RescueData} from "../models/RescueData";

@Component({
  selector: 'app-enroll',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild(LightsComponent)
  lightsComponent: LightsComponent;

  stateDirty = true;
  softwareVersion: string;
  hardwareVersion: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private bleService: BleService,
    private logger: NGXLogger,
    public rescueConf: RescueConf,
    public rescueData: RescueData) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
      }
    });
   }

  ngOnInit() {
    this.rescueConf.deviceName = this.bleService.device.name;
    this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,'config=true');
  }

  async save() {
    const loading = await this.loadingController.create({
      message: 'Saving configuration: ',
      spinner: 'bubbles',
      duration: 5000
    });
    await loading.present();

    for (const [key, value] of Object.entries(this.rescueConf)) {
      loading.message = `Saving configuration: ${key}`;
      await this.saveProperty({key, value: String(value)});
    }
    await this.saveProperty({key: 'save', value: 'true'});
    await loading.dismiss();
    await this.bleService.disconnect();
    await this.router.navigate(['']);
  }

  async saveProperty(property) {
    const str = property.key + '=' + property.value;
    this.logger.debug('Sending: ' + str);
    return this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,str);
  }

  async updateLedType() {
    await this.saveProperty({key: 'ledType', value: this.rescueConf.ledType});
    await this.saveProperty({key: 'ledFrequency', value: this.rescueConf.ledFrequency});
    await this.saveProperty({key: 'save', value: 'true'});
    this.logger.debug('ledType and ledFrequency updated');
  }

  toggleNotificationsEnabled(event){
  }

  async changeName(event) {
    const popover = await this.popoverController.create({
      component: TextinputComponent,
      event,
      componentProps: {
        deviceName: this.rescueConf.deviceName
      },
      keyboardClose: true,
      translucent: true
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    if(data !== undefined && data !== null) {
      this.rescueConf.deviceName = data;
    }
  }

  changeLoglevel(event){
    this.rescueConf.logLevel= event.detail.value;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
        AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,'config=true');
      event.target.complete();
    }, 1000);
  }
}
