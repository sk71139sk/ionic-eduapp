import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, App, AlertController, Events } from 'ionic-angular';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import {ApiProvider} from '../providers/api/api';
import {TargetProvider} from '../providers/target/target';
import {Echo} from 'laravel-echo-ionic';




// import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { google } from "google-maps";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  alert:any;
  echo:any;
  google: google;
  constructor(
    public  app: App,
    public event:Events,
    public target:TargetProvider,
    public platform: Platform,
    private api: ApiProvider,
    public alertCtrl : AlertController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen)
    {
    platform.ready().then(() => {
      //check local storage for a stored student id
      if((localStorage.getItem('student_id'))){
        //call api to check whether token is valid or student exists.
        this.api.checkToken(localStorage.getItem('student_id')).subscribe((res)=>{
            console.log("response HERE:" +res.status);
            this.target.username = localStorage.getItem('student_id');
            this.nav.push(MenuPage);
        });
      }
      else{
        this.nav.push(LoginPage);
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#008080");
        // this.statusBar.styleDefault();
        this.statusBar.show();
      this.splashScreen.hide();
    });

    this.echo = new Echo({
        broadcaster: 'socket.io' ,
        host: this.target.hostname
    });

    // this.echo.channel("event1")
    // .listen("ExampleEvent", e=>{
    //     console.log(e);
    // })

    this.echo.channel("game-over")
    .listen("gameOver", e=>{
        console.log(e.data);
        // console.log(this.target.cat_id);
        if (e.data == this.target.cat_id){
            this.target.event.publish('GameOver');
        }
    })

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
