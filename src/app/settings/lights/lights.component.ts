import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LedTypeComponent} from '../led-type/led-type.component';
import {PopoverController} from '@ionic/angular';
import {NGXLogger} from "ngx-logger";
import { RescueConf } from 'src/app/models/RescueConf';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss'],
})
export class LightsComponent implements OnInit {

  colorPickerControlsStr: any = 'no-alpha';
  colorPickerFormat = 'hex';
  lightColorPrimary = '';
  lightColorSecondary = '';
  @Input() rescueConf: RescueConf;

  constructor(
    private popoverController: PopoverController,
    private logger: NGXLogger) {}

  ngOnInit() {
    this.lightColorPrimary = '#' + Number(this.rescueConf.lightColorPrimary).toString(16);
    this.lightColorSecondary = '#' + Number(this.rescueConf.lightColorSecondary).toString(16);
  }

  @Output() ledTypeUpdate = new EventEmitter();

  async changeLedType(event) {
    const popover = await this.popoverController.create({
      //event,
      component: LedTypeComponent,
      translucent: true,
      showBackdrop: true,
      //backdropDismiss: false,
      cssClass: 'led-type-popover',
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    this.rescueConf.ledType = data.ledType;
    this.rescueConf.ledFrequency = data.ledFrequency;
    this.logger.debug('Selected LED-Type: ' + this.rescueConf.ledType + ' ' + this.rescueConf.ledFrequency);
    this.ledTypeUpdate.emit('updateValues');
    this.ngOnInit();
  }

  updatePrimaryColor(event) {
    this.logger.debug('updatePrimaryColor: ' + event);
    if(event === undefined || event === null) {
      return;
    }
    this.rescueConf.lightColorPrimary = Number('0x' + event.substr(1));
    this.logger.debug('this.rescueConf.lightColorPrimary: ' + this.rescueConf.lightColorPrimary);
  }

  updateSecondaryColor(event) {
    this.logger.debug('updateSecondaryColor: ' + event);
    this.logger.debug('updatePrimaryColor: ' + event);
    if(event === undefined || event === null) {
      return;
    }
    this.rescueConf.lightColorSecondary = Number('0x' + event.substr(1));
    this.logger.debug('this.rescueConf.lightColorSecondary: ' + this.rescueConf.lightColorSecondary);
  }
}
