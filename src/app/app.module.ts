import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';

import { MapPage } from '../pages/map/map';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { PlacesPage } from '../pages/places/places';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { TargetProvider } from '../providers/target/target';


@NgModule({
  declarations: [
    MyApp,
    MapPage,
    TabsNavigationPage,
    PlacesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    TabsNavigationPage,
    PlacesPage
  ],
  providers: [
    SplashScreen,
    StatusBar,
    Geolocation,
    ToastController,
    BackgroundGeolocation,
    LocationTracker,
    TargetProvider
  ]
})
export class AppModule {}
