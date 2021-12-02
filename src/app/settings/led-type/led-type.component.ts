import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-led-type',
  templateUrl: './led-type.component.html',
  styleUrls: ['./led-type.component.scss'],
})
export class LedTypeComponent implements OnInit {

  ledType: string;
  ledFrequency: string;

  constructor(private popover: PopoverController) { }

  ngOnInit() {
    this.ledType = 'GRB';
    this.ledFrequency = '800kHz';
  }

  close() {
    this.popover.dismiss({
      ledType: this.ledType,
      ledFrequency: this.ledFrequency
    });
  }
}
