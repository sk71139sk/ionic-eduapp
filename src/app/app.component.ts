import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, App, AlertController } from 'ionic-angular';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";



// import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { LoginPage } from '../pages/login/login';
import { google } from "google-maps";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  alert:any;
  google: google;
  constructor(
    public  app: App,
    public platform: Platform,
    public alertCtrl : AlertController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.nav.push(LoginPage);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#008080");
        // this.statusBar.styleDefault();
        this.statusBar.show();
      this.splashScreen.hide();
    });

    platform.registerBackButtonAction(() => {
 
      let nav = app.getActiveNav()[0];
      let activeView = nav.getActive();                
   
      if(activeView.name === "LoginPage") {
   
          if (nav.canGoBack()){ //Can we go back?
              nav.pop();
          } else {
              this.alert = this.alertCtrl.create({
                  title: 'App termination',
                  message: 'Do you want to close the app?',
                  buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                          console.log('Application exit prevented!');
                      }
                  },{
                      text: 'Close App',
                      handler: () => {
                          this.platform.exitApp(); // Close this application
                      }
                  }]
              });
              this.alert.present();
          }
      }
  });
  }
}
