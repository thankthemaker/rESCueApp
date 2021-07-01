import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
})
export class VersionsComponent implements OnInit {

  constructor(private popover: PopoverController) { }

  @Input() versions: any;

  ngOnInit() {}

  close(version: string) {
    this.popover.dismiss(version);
  }
}
