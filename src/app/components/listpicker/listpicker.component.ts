import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-listpicker',
  templateUrl: './listpicker.component.html',
  styleUrls: ['./listpicker.component.scss'],
})
export class ListpickerComponent implements OnInit {

  constructor(private popover: PopoverController) { }

  @Input() title: string = '';
  @Input() items: any;

  ngOnInit() {}

  close(item: string) {
    this.popover.dismiss(item);
  }
}
