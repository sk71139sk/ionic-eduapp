import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{ ApiProvider } from '../../providers/api/api'
import { TargetProvider } from '../../providers/target/target';
import { LoadingController } from 'ionic-angular';

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

    this.target.cat_id = value;
    console.log('{menu} category id: ',this.target.cat_id);
    this.api.checkNumLevel(this.target.cat_id).subscribe(
      res => {
        this.target.numLev = res[0].numLev;  
        console.log("{menu} Total Number of Levels: " , this.target.numLev); 
    })
    this.navCtrl.setRoot(TabsNavigationPage); 


    
  }


}
