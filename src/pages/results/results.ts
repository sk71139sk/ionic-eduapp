import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController ,Loading,LoadingController } from 'ionic-angular';
import {TargetProvider} from '../../providers/target/target';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the ResultsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
public data:any = [];
public results:any = [];
loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public target:TargetProvider,
    public loadingCtrl:LoadingController,
    public api: ApiProvider
  ) {
    this.data = this.navParams.data.data;
    this.loadResults();
    // console.log(this.data);
   
  }

  ionViewDidLoad() {
    console.log("page loaded");
  }

  showLoading() {
    if (!this.loading){
      this.loading = this.loadingCtrl.create({
        content: "Loading..."
        });
        this.loading.present();
    }

    }

  dismissLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }

  }

  loadResults(){
    this.showLoading();
    this.api.loadresults(this.data).subscribe(
      res=>{
        // console.log(res);
        this.results = res;
        // console.log(this.results);
        // for (let data of res){
          // console.log(data.results);
        // }
        this.dismissLoading();
    });
  }

}
