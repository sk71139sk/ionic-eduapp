//imports
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, App, AlertController, Events } from 'ionic-angular';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import {ApiProvider} from '../providers/api/api';
import {TargetProvider} from '../providers/target/target';
import {Echo} from 'laravel-echo-ionic';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { google } from "google-maps";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})

/* This Application is made for the mLearn team of USP, the team acknowledges the copyrights of all plugins used. 
*  They are referenced in respective node module folders and plugins folders by the authors. All rights reserved.
*  The team has used Open Source Licenced plugins, therefore for commercial purposes, the client MUST seek 
*  permission from the authors of the plugins.
*/

//declarations
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

        //call api to check whether token is valid or student exists before putting up a page
        this.api.checkToken(localStorage.getItem('student_id')).subscribe((res)=>{
            if(res.status == '200'){
            this.target.username = localStorage.getItem('student_id');
            this.nav.push(MenuPage);  // token is valid , redirect to app
            }
            else{
                localStorage.clear();
                this.nav.push(LoginPage); // token expired, redirect to login page
            }

        });
      }
      else{
        this.nav.push(LoginPage); // incase of no username or token present, or bug, redirect to login page
      }

      this.statusBar.backgroundColorByHexString("#008080"); //set color of status bar
      this.statusBar.show();
      this.splashScreen.hide();
    });


    //connect and listen to the server
    this.echo = new Echo({
        broadcaster: 'socket.io' ,
        host: this.target.hostname
    });

    //listen for game-over event
    this.echo.channel("game-over")
    .listen("gameOver", e=>{
        console.log(e.data);
        if (e.data == this.target.cat_id){
            let dataSend = false;
            this.target.event.publish('GameOver', dataSend);
        }
    });

    //listen for score changes to update scoreboard
    this.echo.channel("score-changed")
    .listen("scoreChanged", e=>{
        console.log('score changed');
        console.log(e.data);
        if (e.data == this.target.cat_id){
            console.log('publishing');
            this.target.event.publish('score-changed');
        }
    });

    //listen to changes to coconut locations
    this.echo.channel("refresh-coconuts")
    .listen("refreshCoconuts", e=>{
        console.log(e.data[0].lat,e.data[0].lng,e.data[1].lat,e.data[1].lng,e.data[2].lat,e.data[2].lng);
        this.target.setCoordsCoco(e.data[0].lat,e.data[0].lng,e.data[1].lat,e.data[1].lng,e.data[2].lat,e.data[2].lng);

    });

    //listen to back button events and block back button
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
