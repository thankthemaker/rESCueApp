import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LoadingController, PopoverController } from '@ionic/angular';
import {BleService} from '../services/ble.service';
import {LightsComponent} from './lights/lights.component';
import {AppSettings} from '../models/AppSettings';
import {NGXLogger} from 'ngx-logger';
import {TextinputComponent} from '../components/textinput/textinput.component';
import {RescueConf} from '../models/RescueConf';
import {RescueData} from '../models/RescueData';
import { EventService } from '../services/event.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-enroll',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  @ViewChild(LightsComponent)
  lightsComponent: LightsComponent;

  stateDirty = true;
  softwareVersion: string;
  hardwareVersion: string;
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private bleService: BleService,
    private storageService: StorageService,
    private events: EventService,
    private logger: NGXLogger,
    public rescueConf: RescueConf,
    public rescueData: RescueData) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
      }
    });

    events.getObservable().subscribe((data) => {
      //console.log("Event " + data);
      this.loadingController.dismiss();
    })
   }

  async ionViewDidEnter() {
    let cells = Number(await this.storageService.get('battery.cells'));
    let groups = Number(await this.storageService.get('battery.groups'));
    let cellcapacity = Number(await this.storageService.get('battery.cellcapacity'));
    this.rescueConf.batteryType =  cells+ 's' + groups + 'p ' + groups*cellcapacity / 1000 + 'Ah';
    this.rescueConf.deviceName = this.bleService.device.name;
    await this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,'config=true');

    this.showLoading();   
}

  async ionViewDidLeave() {
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
      if(typeof this.rescueConf[key] === "boolean") {
        await this.saveProperty({key, value: value ? 1 : 0});
      } else {
        await this.saveProperty({key, value: String(value)});
      }
    }
    await this.saveProperty({key: 'save', value: 'true'});
    await loading.dismiss();
    await this.bleService.disconnect(true);
  }

  async saveProperty(property) {
    const propertyString = property.key + '=' + property.value;
    this.logger.debug('Sending: ' + propertyString);
    return this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,propertyString, true);
  }

  async updateLedType() {
    await this.saveProperty({key: 'ledType', value: this.rescueConf.ledType});
    await this.saveProperty({key: 'ledFrequency', value: this.rescueConf.ledFrequency});
    await this.saveProperty({key: 'save', value: 'true'});
    this.logger.debug('ledType and ledFrequency updated');
  }

  async updateLightBarLedType() {
    await this.saveProperty({key: 'lightBarLedType', value: this.rescueConf.lightBarLedType});
    await this.saveProperty({key: 'lightBarLedFrequency', value: this.rescueConf.lightBarLedFrequency});
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
        inputString: this.rescueConf.deviceName
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
        this.showLoading();
        event.target.complete();
    }, 500);
  }

  async showLoading() {
    this.loadingIndicator = await this.loadingController.create({
      message: 'Loading configuration: ',
      spinner: 'circles',
      duration: 5000
    });

    await this.loadingIndicator.present();   
  }
}
