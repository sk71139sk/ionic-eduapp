import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController ,Loading,LoadingController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { ApiProvider } from '../../providers/api/api';
import { AlertController } from 'ionic-angular';



/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
loading: Loading;
public questions : Array<any>;
// public answers : Array<any> = [];
// public alertScore : any;

  constructor(public loadingCtrl:LoadingController,private view: ViewController , private navParams: NavParams, private alertCtrl: AlertController,public api:ApiProvider,public target:TargetProvider) {
  }

  ionViewDidLoad() {
    this.target.numLev = this.target.numLev - 1;
    this.target.lev_id = this.target.lev_id + 1;
    console.log("Loaded Level: ", this.target.lev_id);
    console.log("Levels Remaining: ", this.target.numLev);
    this.loadCards();
  }

  closeModal(){
    if (this.view){
      this.view.dismiss();
      // console.log("saving level, level number is "+ this.target.lev_id);
      // this.api.saveGame(this.target.username,this.target.cat_id,this.target.lev_id,this.target.score).subscribe(
      //   res => {
      //     console.log(res);
      //   }
      // )
    }



  }

  loadCards(){
    this.showLoading();
    console.log("modal sees level ", this.target.lev_id);
    this.api.loadQuestions(this.target.lev_id,this.target.cat_id).subscribe(
      res => {
        console.log("this is res: ", res);
        this.questions = (res);
        for (let data of res){
          console.log("This is data: ", data);
          this.dismissLoading();
          // this.questions.push(data);
          
          // console.log("Question ",data.Number , ": " , data.Content);
          // for (let ans of data.answers){ 
          //   console.log("This is ans: ", ans);
          // }
          
        }

        // console.log(this.questions);
         //console.log("this is the data: " ,this.questions);
      }
    );

    //console.log("this is questions: ",this.questions);
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

  pushAns(valueq:any,valuea:any){
    this.target.answers.splice(valueq,this.target.answers.length ,valuea);   
  }

}
