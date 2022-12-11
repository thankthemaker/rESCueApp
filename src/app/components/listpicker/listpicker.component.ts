import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-listpicker',
  templateUrl: './listpicker.component.html',
  styleUrls: ['./listpicker.component.scss'],
})
export class ListpickerComponent implements OnInit {

  @Input() title = '';
  @Input() items: any;

  constructor(private popover: PopoverController) { }

  ngOnInit() {}

  close(item: string) {
    this.popover.dismiss(item);
  }
}
