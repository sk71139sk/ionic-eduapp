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

import { MapPage } from '../pages/map/map';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { ModalPage } from '../pages/modal/modal';
import {ResultsPage} from '../pages/results/results';
import {ProfilePage} from '../pages/profile/profile';

import { MenuPage } from '../pages/menu/menu';
import {LoginPage} from '../pages/login/login';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { TargetProvider } from '../providers/target/target';
import { ApiProvider } from '../providers/api/api';

const config:SocketIoConfig = {url: 'http://127.0.0.1:6001', options: {}};
// const config:SocketIoConfig = {url: 'http://27.123.150.94:6001', options: {}};
// const config:SocketIoConfig = {url: 'http://192.168.8.161:6001', options: {}};


@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ModalPage,
    LoginPage,
    ResultsPage,
    ProfilePage,
    TabsNavigationPage,
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
    ProfilePage,
    MenuPage,
    TabsNavigationPage
  ],
  providers: [
    SplashScreen,
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
