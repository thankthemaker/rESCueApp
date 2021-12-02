import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LedTypeComponent} from '../led-type/led-type.component';
import { PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss'],
})
export class LightsComponent implements OnInit {

  @Input() rescueConf: any;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

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

    const { data } = await popover.onDidDismiss();
    this.rescueConf.ledType = data.ledType;
    this.rescueConf.ledFrequency = data.ledFrequency;
    console.log('Selected LED-Type: ' + this.rescueConf.ledType + ' ' + this.rescueConf.ledFrequency);
    this.ledTypeUpdate.emit('updateValues');
    this.ngOnInit();
  }

  changeIdleLightIndex(event) {
    this.rescueConf.idleLightIndex = event.detail.value;
  }

  changeStartLightIndex(event) {
    this.rescueConf.startLightIndex = event.detail.value;
  }

  changeLedFadingDuration(event) {
    this.rescueConf.lightFadingDuration = event.detail.value;
  }

  changeLedMaxBrightness(event) {
    this.rescueConf.lightMaxBrightness = event.detail.value;
  }

  changeMinBrakeLightsAmp(event) {
    this.rescueConf.brakeLightMinAmp = event.detail.value;
  }
}
