import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.page.html',
  styleUrls: ['./enroll.page.scss'],
})
export class EnrollPage implements OnInit {

  device: BleDevice
  softwareVersion: string
  hardwareVersion: string

  constructor(      
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.device = this.router.getCurrentNavigation().extras.state.device;
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;        
      }
    })
   }

  ngOnInit() {
  }


  save() {
    this.router.navigate([''])   
  }
}
