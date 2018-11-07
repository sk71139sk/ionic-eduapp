//imports
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, LoadingController, Loading } from 'ionic-angular';
import {MenuPage} from '../menu/menu';
import { TargetProvider } from '../../providers/target/target';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 //declarations
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  passwordType: string = "password";
  passwordShown: boolean = false;
  loading: Loading;
  credentials = { username: '', password: '' 
  };

  constructor(
    public toastCtrl: ToastController, private api: ApiProvider,
    public target : TargetProvider,
    private navCtrl: NavController, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}


  /* Login function sending username and password to API provider */
  login(username: any, password: any) {
    this.showLoading();
    this.api.checkUSPApi(username, password).subscribe(res => {
      if (res.status == '422') {     
        this.showError("Your password or username do not match our records. Please enter correct login details.")
      }
      else if (res.status == '200') {
        this.presentToast('Login successful');
        console.log(username);
        this.target.username = username;
        localStorage.setItem('student_id',username);
        this.navCtrl.push(MenuPage);
          }
        
        });
    }

  //toggle password visible
  showPassword() {
      this.passwordType = 'text';
  }

  //toggle password invisible
  hidePassword(){
    this.passwordType = 'password';
  }

  //loader start
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      });
      this.loading.present();
    }

  //show the toast to user on successful login
  presentToast(text:any) {
    this.loading.dismiss();
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  //show error on wrong login credentials
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


