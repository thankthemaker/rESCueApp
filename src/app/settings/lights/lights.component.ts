import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LedTypeComponent} from '../led-type/led-type.component';
import {PopoverController} from '@ionic/angular';

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
  @Input() rescueConf: any;

  constructor(private popoverController: PopoverController) {
  }

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
    console.log('Selected LED-Type: ' + this.rescueConf.ledType + ' ' + this.rescueConf.ledFrequency);
    this.ledTypeUpdate.emit('updateValues');
    this.ngOnInit();
  }

  updatePrimaryColor(event) {
    console.log('updatePrimaryColor: ' + event);
    this.rescueConf.lightColorPrimary = Number('0x' + event.substr(1));
    console.log('this.rescueConf.lightColorPrimary: ' + this.rescueConf.lightColorPrimary);
  }

  updateSecondaryColor(event) {
    console.log('updateSecondaryColor: ' + event);
    this.rescueConf.lightColorSecondary = Number('0x' + event.substr(1));
    console.log('this.rescueConf.lightColorSecondary: ' + this.rescueConf.lightColorSecondary);
  }
}
