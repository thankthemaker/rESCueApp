import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  description: string;

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  public isMenuOpen = false;

  constructor() { }

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public broadcastName(name: string): void {
    this.change.emit(name);
  }
}
