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
import { MapPage } from '../pages/map/map';
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
            this.target.username = localStorage.getItem('student_id');
            this.nav.push(MenuPage);
        });
      }
      else{
        this.nav.push(LoginPage);
      }

      this.statusBar.backgroundColorByHexString("#008080");
      this.statusBar.show();
      this.splashScreen.hide();
    });


    //connect and listen to the server
    this.echo = new Echo({
        broadcaster: 'socket.io' ,
        host: this.target.hostname
    });

    this.echo.channel("game-over")
    .listen("gameOver", e=>{
        console.log(e.data);
        if (e.data == this.target.cat_id){
            this.target.event.publish('GameOver');
        }
    });

    this.echo.channel("score-changed")
    .listen("gameOver", e=>{
        console.log(e.data);
        if (e.data == this.target.cat_id){
            this.target.event.publish('score-changed');
        }
    });


    this.echo.channel("refresh-coconuts")
    .listen("refreshCoconuts", e=>{
        console.log(e.data[0].lat,e.data[0].lng,e.data[1].lat,e.data[1].lng,e.data[2].lat,e.data[2].lng);
        this.target.setCoordsCoco(e.data[0].lat,e.data[0].lng,e.data[1].lat,e.data[1].lng,e.data[2].lat,e.data[2].lng);

    });

    //listen to back button events
    this.platform.registerBackButtonAction(() => {
 
      let nav = app.getActiveNav()[0];
      let activeView = nav.getActive();                
   
      if(activeView.name === "MapPage") {
              this.alert = this.alertCtrl.create({
                  title: 'Quit Game?',
                  message: 'Do you want to close this game?',
                  buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                          console.log('Application exit prevented!');
                      }
                  },{
                      text: 'Close App',
                      handler: () => {
                          this.nav.pop(); 
                      }
                  }]
              });
              this.alert.present();
          }
        });
    }
  

}
