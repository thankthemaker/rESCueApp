import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-install',
  templateUrl: './install.page.html',
  styleUrls: ['./install.page.scss'],
})
export class InstallPage {

  constructor(private sanitizer: DomSanitizer) { }

  secureUrl(url: string) {
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
