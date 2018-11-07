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

//  declarations
@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})

// class declarations and definitions
export class ModalPage {
loading: Loading;
public questions : Array<any>;

//definition of all variables
  constructor(
    public loadingCtrl:LoadingController,
    private view: ViewController ,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    public api:ApiProvider,
    public target:TargetProvider
  ){}

  //on page load, these functions are called, and these operations are carried out
  ionViewDidLoad() {
    this.target.numLev = this.target.numLev - 1;
    this.target.lev_id = this.target.lev_id + 1;
    console.log("Loaded Level: ", this.target.lev_id);
    console.log("Levels Remaining: ", this.target.numLev);
    this.loadCards();
  }

  //close the view
  closeModal(){
    if (this.view){
      this.view.dismiss();
    }
  }

  //laod the data | Async
  loadCards(){
    this.showLoading();
    console.log("modal sees level ", this.target.lev_id);
    this.api.loadQuestions(this.target.lev_id,this.target.cat_id).subscribe(
      res => {
        console.log("this is res: ", res);
        this.questions = (res);
        this.target.question = [];
        for (let data of res){
          console.log("This is ques Ids: ", data.ID); 
          this.target.question.push(data.ID);
          this.dismissLoading();          
        }
      }
    );
  }

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

  //store answer to an array
  pushAns(valueq:any,valuea:any){
    this.target.answers.splice(valueq,this.target.answers.length ,valuea);   
  }

}
