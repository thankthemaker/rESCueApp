import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss'],
})
export class TextinputComponent implements OnInit {

  @Input()
  deviceName: string;

  constructor(private popover: PopoverController) {
  }

  ngOnInit() {
  }

  close() {
    console.log('deviceName:', this.deviceName);
    this.popover.dismiss(this.deviceName);
  }
}
