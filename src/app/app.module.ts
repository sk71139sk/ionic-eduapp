import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';

import { MapPage } from '../pages/map/map';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { ModalPage } from '../pages/modal/modal';

import { MenuPage } from '../pages/menu/menu';
import {LoginPage} from '../pages/login/login';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { TargetProvider } from '../providers/target/target';
import { ApiProvider } from '../providers/api/api';

const config:SocketIoConfig = {url: 'http://localhost:6001', options: {}};


@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ModalPage,
    LoginPage,
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
    MenuPage,
    TabsNavigationPage
  ],
  providers: [
    SplashScreen,
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
