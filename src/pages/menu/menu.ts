import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { TargetProvider } from '../../providers/target/target';
import { LoadingController, Loading } from 'ionic-angular';
import { MapPage } from '../map/map';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {

  public loading: Loading;
  categories: any[];

  constructor
    (
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public target: TargetProvider,
    public api: ApiProvider,
    public navParams: NavParams) {
    this.loadCat();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  loadCat() {
    this.showLoadingCat();
    this.api.getCategories().subscribe(
      res => {
        this.categories = res;
      })
    this.dismissLoading();

  }

  startGame(value: any, name: any) {

    this.target.cat_id = value;
    this.target.cat_name = name;
    console.log('{menu} category id: ', this.target.cat_id);
    this.showLoadingGame();
    this.api.checkNumLevel(this.target.cat_id).subscribe(
      res => {
        this.target.numLev = res[0].numLev;
        this.target.lev_id = 1;
        console.log("{menu} Total Number of Levels: ", this.target.numLev);
        this.navCtrl.push(MapPage);
      });

  }

  showLoadingGame() {

    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Loading Game...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }

  }

  showLoadingCat() {

    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Loading Menu..."
      });
      this.loading.present();
    }

  }

  dismissLoading() {

    if (this.loading) {
      this.loading.dismiss();
      // this.loading = null;
    }

  }

}
