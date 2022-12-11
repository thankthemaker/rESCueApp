import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-install',
  templateUrl: './install.page.html',
  styleUrls: ['./install.page.scss'],
})
export class InstallPage implements OnInit {

  espWebInstaller: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.espWebInstaller = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://rescue.thank-the-maker.org/webinstaller/index.html'
    );
  }
}
