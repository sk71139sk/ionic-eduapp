//imports
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

 //declarations
@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
public data:any = [];
public results:any = [];
loading: Loading;

//constructor for varibale definitions
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private view: ViewController,
    public target:TargetProvider,
    public loadingCtrl:LoadingController,
    public api: ApiProvider
  ) {
    // Initial loading of data
    this.data = this.navParams.data.data;
    this.loadResults();   
  }

  ionViewDidLoad() {}

  //show loader
  showLoading() {
    if (!this.loading){
      this.loading = this.loadingCtrl.create({
        content: "Loading..."
        });
        this.loading.present();
      }
  }

  //hide loader
  dismissLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  //load results through api call
  loadResults(){
    this.showLoading();
    this.api.loadresults(this.data).subscribe(
      res=>{
        this.results = res;
        this.dismissLoading();
    });
  }

  //close results page
  closeModal(){
    if (this.view){
      this.view.dismiss();
    }
  } 
}