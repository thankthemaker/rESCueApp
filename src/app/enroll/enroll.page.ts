import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BleService } from '../services/ble.service';


@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.page.html',
  styleUrls: ['./enroll.page.scss'],
})
export class EnrollPage implements OnInit {

  deviceName: string
  softwareVersion: string
  hardwareVersion: string
  authToken: string
  vescId: number 
  ledPixel: number
  batmonPixel: number

  constructor(      
    private route: ActivatedRoute,
    private router: Router,
    private bleService: BleService) {

    this.vescId = 25
    this.ledPixel = 16
    this.batmonPixel = 5
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion        
      } 
    })
   }

  ngOnInit() {
    this.deviceName = this.bleService.device.name
  }


  async save() {
    await this.saveProperty('authToken', this.authToken);
    await this.saveProperty('vescId', '' + this.vescId);
    await this.saveProperty('numberPixelLight', '' + this.ledPixel);
    await this.saveProperty('numberPixelBatMon', '' + this.batmonPixel);
    await this.saveProperty('otaUpdateActive', 'false');
    await this.saveProperty('save', 'true');

    this.router.navigate([''])   
  }

  async saveProperty(key: string, value: string) {
    const str = key + '=' + value
    return this.bleService.write(str);
  }
}
