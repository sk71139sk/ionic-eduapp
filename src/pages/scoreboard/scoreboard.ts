import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController ,Loading,LoadingController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the ScoreboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html',
})
export class ScoreboardPage {

  dataArray:any;

  constructor(public navCtrl: NavController,private view:ViewController,public target:TargetProvider,public api:ApiProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScoreboardPage');
    this.api.loadScoreBoard().subscribe(
      (res)=>{
        console.log(res);
        this.dataArray = res;
      }
    );

    this.target.event.subscribe('score-changed',
      ()=>{
        this.api.loadScoreBoard().subscribe(
          (res)=>{
            console.log(res);
            this.dataArray = res;
          })
        })
    
    
  }

  closeModal(){
    if (this.view){
      this.view.dismiss();
    }
  } 
}
