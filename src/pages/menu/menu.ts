import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{ ApiProvider } from '../../providers/api/api'
import { TargetProvider } from '../../providers/target/target';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {

categories : any[];
coords : any[];
coordlat : any;
coordlng : any;
last : any;
// data: any;
  constructor(public navCtrl: NavController, public target: TargetProvider, public api : ApiProvider, public navParams: NavParams) {

    this.loadCat();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MenuPage');

  }

  loadCat(){
    this.api.getCategories().subscribe(
      res => {
         this.categories =  res;
      })
  }

  startGame(value:any){

    
    // console.log(value);
    this.target.cat_id = value;
    this.target.lev_id = 1;

    


    // console.log(this.last);

  
 
    //this.loadFirstLevel(value);

   
  }

  loadFirstLevel(value:any){
    this.api.getLevelCoords(value).subscribe(
      res => 
      {this.coords = res;
      console.log('my coords:', res.lat, res.lng)
      this.target.testLat = res.lat;
      this.target.testLng = res.lng;
      console.log(this.target.testLat,this.target.testLng);
      this.navCtrl.setRoot(TabsNavigationPage);
    })
  }
}
