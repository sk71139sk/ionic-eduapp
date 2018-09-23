import { Component } from '@angular/core';
import { IonicPage, ViewController, Loading, LoadingController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  loading: Loading;
  public questions: Array<any>;
  // public answers : Array<any> = [];
  // public alertScore : any;

  constructor(
    public loadingCtrl: LoadingController,
    private view: ViewController,
    public api: ApiProvider,
    public target: TargetProvider
  ) {}

  ionViewDidLoad() {
    this.loadCards();
  }

  closeModal() {
    if(this.view){
      this.view.dismiss();
      // this.view = null;
    }
    this.target.numLev = this.target.numLev - 1;
    this.target.lev_id = this.target.lev_id + 1;
    if (this.target.numLev == 0) {
      this.target.gameOver = true;
    }
  }

  loadCards() {
    this.showLoading();
    this.api.loadQuestions(this.target.lev_id, this.target.cat_id).subscribe(
      res => {
        console.log("this is res: ", res);
        this.questions = (res);
        for (let data of res) {
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
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Loading..."
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  pushAns(valueq: any, valuea: any) {
    this.target.answers.splice(valueq, this.target.answers.length, valuea);
    // console.log("this is pressed: ",valueq,valuea);
    // console.log("this is stored",this.answers)
  }

}
