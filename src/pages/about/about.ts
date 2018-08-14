import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,    public target : TargetProvider, 
    public alertCtrl: AlertController) {

  }
  changeValue(value1:any,value2:any,value3:any){
    this.target.safeArea = value1;
    this.target.testLat = value2;
    this.target.testLng = value3;
    this.target.alertGiven = false;
    let alert = this.alertCtrl.create({
      title: 'Done',
      subTitle: 'Changes applied, navigate back to the map to view changes!',
      buttons: ['Close']
    });
    alert.present();
  }
}
