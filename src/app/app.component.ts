import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";

// import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { MenuPage } from '../pages/menu/menu';
import { google } from "google-maps";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  google: google;
  constructor(
    platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.nav.push(MenuPage);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#008080");
        // this.statusBar.styleDefault();
        this.statusBar.show();
      this.splashScreen.hide();
    });
  }
}
