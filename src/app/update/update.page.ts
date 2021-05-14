import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  progress: number

  constructor(
    private router: Router,
    private toastCtrl: ToastController) { 
      this.progress = 0;
  }

  ngOnInit() {
    this.updateDevice()
  }

  async updateDevice() {
    console.log('started update')
    for(this.progress = 0; this.progress<100; this.progress++) {
      console.log('Progress: ' + this.progress)
      await this.delay(50)
   }
   this.updateFinished(true);
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
  }

  async updateFinished(successful: boolean) {
    const toast = await this.toastCtrl.create({
      header: successful ? 'Update finished' : 'Update failed',
      message: 'Your update was ' + (successful ? 'successful, please restart your device.' : 'not successful.'),
      position: 'middle',
      color: successful ? 'success' : 'danger',
      animated: true,
      buttons: [
        {
          text: 'OK',
          role: 'ok'
        }
      ]
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
    this.router.navigate([''])  
  }
}
