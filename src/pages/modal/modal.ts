import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController , } from 'ionic-angular';
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

public questions : Array<any>;
// public answers : Array<any> = [];
// public alertScore : any;

  constructor(private view: ViewController , private navParams: NavParams, private alertCtrl: AlertController,public api:ApiProvider,public target:TargetProvider) {
  }

  ionViewDidLoad() {
    this.loadCards();
  }

  closeModal(){
    this.view.dismiss();
    this.target.numLev = this.target.numLev - 1;
    this.target.lev_id = this.target.lev_id + 1;
    if (this.target.numLev  == 0 ){
      this.target.gameOver = true;
    }
  }

  loadCards(){
    this.api.loadQuestions(this.target.lev_id,this.target.cat_id).subscribe(
      res => {
        console.log("this is res: ", res);
        this.questions = (res);
        for (let data of res){
          console.log("This is data: ", data);
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

  pushAns(valueq:any,valuea:any){
    this.target.answers.splice(valueq,this.target.answers.length ,valuea);   
    // console.log("this is pressed: ",valueq,valuea);
    // console.log("this is stored",this.answers)
  }

}
