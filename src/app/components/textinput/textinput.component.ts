import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss'],
})
export class TextinputComponent implements OnInit {

  @Input()
  inputString: string;

  constructor(private popover: PopoverController) {
  }

  ngOnInit() {
  }

  close() {
    console.log('inputString:', this.inputString);
    this.popover.dismiss(this.inputString);
  }
}
