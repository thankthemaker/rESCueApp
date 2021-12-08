import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {BleService} from '../services/ble.service';
import {LightsComponent} from './lights/lights.component';

@Component({
  selector: 'app-enroll',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild(LightsComponent)
  lightsComponent: LightsComponent;

  deviceName: string;
  softwareVersion: string;
  hardwareVersion: string;
  rescueConf = {
    lowBatteryVoltage: 42.0,
    minBatteryVoltage: 40.0,
    maxBatteryVoltage: 50.4,
    startSoundIndex: 1,
    startLightIndex: 1,
    batteryWarningSoundIndex: 1,
    batteryAlarmSoundIndex: 1,
    startLightDuration: 1000,
    idleLightIndex: 1,
    idleLightTimeout: 60000,
    lightFadingDuration: 50,
    lightMaxBrightness: 100,
    lightColorPrimary: 16777215,
    lightColorSecondary: 16711680,
    brakeLightEnabled: false,
    brakeLightMinAmp: 4,
    numberPixelLight: 16,
    numberPixelBatMon: 5,
    vescId: 25,
    authToken: '',
    logLevel: 0,
    realtimeDataInterval: 300,
    balanceDataInterval: 300,
    ledType: 'GRB',
    ledFrequency: '800kHz',
    batteryType: '12s2p, 6Ah',
    isNotificationEnabled: true,
    isBatteryNotificationEnabled: true,
    isCurrentNotificationEnabled: true,
    isErpmNotificationEnabled: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private bleService: BleService) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
      }
    });
   }

  ngOnInit() {
    this.deviceName = this.bleService.device.name;
    this.bleService.startNotifications((value: DataView) => {
      const values = String.fromCharCode.apply(null, new Uint8Array(value.buffer)).split('=');
      console.log('Received: ' + values );
      this.rescueConf[values[0]] = values[1];
    });
    this.bleService.write('config=true');
  }

  async save() {
    for (const [key, value] of Object.entries(this.rescueConf)) {
      await this.saveProperty({key, value: String(value)});
    }
    await this.saveProperty({key: 'save', value: 'true'});
    this.router.navigate(['']);
  }

  async saveProperty(property) {
    const str = property.key + '=' + property.value;
    console.log('Sending: ' + str);
    return this.bleService.write(str);
  }

  async updateLedType() {
    await this.saveProperty({key: 'ledType', value: this.rescueConf.ledType});
    await this.saveProperty({key: 'ledFrequency', value: this.rescueConf.ledFrequency});
    await this.saveProperty({key: 'save', value: 'true'});
    console.log('ledType and ledFrequency updated');
  }

  toggleNotificationsEnabled(event){
  }

  changeLoglevel(event){
    this.rescueConf.logLevel= event.detail.value;
  }
}
