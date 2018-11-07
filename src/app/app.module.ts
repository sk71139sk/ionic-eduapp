import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';
import { Camera } from '@ionic-native/camera';
import { Vibration } from '@ionic-native/vibration';

import { MapPage } from '../pages/map/map';
import { ModalPage } from '../pages/modal/modal';
import {ResultsPage} from '../pages/results/results';
import {ProfilePage} from '../pages/profile/profile';

import { MenuPage } from '../pages/menu/menu';
import {LoginPage} from '../pages/login/login';
import {ScoreboardPage} from '../pages/scoreboard/scoreboard';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { TargetProvider } from '../providers/target/target';
import { ApiProvider } from '../providers/api/api';


/* The connection strings must be uncommented depending on the testing scenario */

// const config:SocketIoConfig = {url: 'http://127.0.0.1:6001', options: {}};
const config:SocketIoConfig = {url: 'http://27.123.150.94:6001', options: {}};
// const config:SocketIoConfig = {url: 'http://localIpHere:6001', options: {}};

//declarations
@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ModalPage,
    LoginPage,
    ScoreboardPage,
    ResultsPage,
    ProfilePage,
    MenuPage 
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ModalPage,
    MapPage,
    LoginPage,
    ResultsPage,
    ScoreboardPage,
    ProfilePage,
    MenuPage
  ],
  providers: [
    SplashScreen,
    Vibration,
    Camera,
    StatusBar,
    Geolocation,
    ToastController,
    BackgroundGeolocation,
    LocationTracker,
    TargetProvider,
    ApiProvider
  ]
})
export class AppModule {}
