import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Controls {
   constructor(
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public alertCtrl: AlertController
   ) {}

   async showLoading(message){
		let loading = await this.loadingCtrl.create({
		  message: message,
		  duration: 20000,
		  showBackdrop: true,
		  spinner: "crescent",
		  mode: 'ios',
		  translucent: true,
		  cssClass: `background: white`

		});
  
		loading.present();
    }
    
    async showToast(message){
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom'
     });

     await toast.present();
   }

   async showAlert(header, message, buttons){
     const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: buttons,
     })

     await alert.present();
   }
}