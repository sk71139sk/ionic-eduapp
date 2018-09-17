import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, LoadingController, Loading } from 'ionic-angular';

import {MenuPage} from '../menu/menu';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  passwordType: string = "password";
  passwordShown: boolean = false;

  loading: Loading;
  credentials = { username: '', password: '' };

  constructor(
    public toastCtrl: ToastController, private api: ApiProvider,
    private navCtrl: NavController, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
  // constructor(private api: ApiProvider, private navCtrl: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  login(username: any, password: any) {
    this.showLoading();
    this.api.checkUSPApi(username, password).subscribe(res => {
      if (res == 1) {
        // return false;
        this.showError("Your password or username do not match our records. Please enter correct login details.")
      }
      else if (res == 0) {
        this.presentToast();
        this.navCtrl.push(MenuPage);
      }
    }, error => {
      this.showError("Error Received " + error);
    }
  );
}

// showPassword() {
//   this.passwordShown = !this.passwordShown;

//   if (this.passwordShown) {
//     this.passwordType = 'text';
//   } else {
//     this.passwordType = 'password';
//   }

// }

showPassword() {
    this.passwordType = 'text';
}
hidePassword(){
  this.passwordType = 'password';
}

showLoading() {
  this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange: true
    });
    this.loading.present();
  }

  presentToast() {
    this.loading.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Login successful',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Login Attempt Failed',
      subTitle: text,
      buttons: ['OK'],
    });
    alert.present();
  }
}


