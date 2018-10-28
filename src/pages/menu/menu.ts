import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{ ApiProvider } from '../../providers/api/api'
import { TargetProvider } from '../../providers/target/target';
import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import {ProfilePage} from '../profile/profile';





// import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import {MapPage} from '../map/map';

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

public loading: Loading;
public resAlert :any;

categories : any[];
modalRs: any;
catType : any = 'All';
cats : any ={
  All : [],
  Saved: [],
  Completed : []
}


// data: any;
  constructor(
    private alertCtrl: AlertController,
    public modalCtrl : ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public target: TargetProvider, 
    public api : ApiProvider, 
    public navParams: NavParams) 
    {
      this.loadCat();
 
    }

  ionViewDidLoad() {
   
    //console.log('ionViewDidLoad MenuPage');


  }

  loadCat(){
    this.showLoadingCat();
    // this.api.getCategories().subscribe(
    //   res => {
    //     this.categories = res;
    //   })

    this.api.getCategories2(this.target.username).subscribe(
      res => {
        this.cats.All = res;
      })
    this.api.getSavedCategories(this.target.username).subscribe(
      res => {
          this.cats.Saved = res;
      })
    this.api.getCompCategories(this.target.username).subscribe(
      res => {
          this.cats.Completed = res;
      })
      this.dismissLoading();
  }

  startGame(value:any,name:any){
    this.target.cat_id = value;
    this.target.cat_name = name;
    console.log('{menu} category id: ',this.target.cat_id);
    this.showLoadingGame();
    this.api.createSession(this.target.username,this.target.cat_id).subscribe();
    this.api.checkNumLevel(this.target.cat_id).subscribe(
      res => {
        this.target.numLev = res[0].numLev;  
        this.target.score = 0;
        this.target.lev_id = 0;
        // this.target.lev_id = 1;
        console.log("{menu} Total Number of Levels: " , this.target.numLev); 
        this.navCtrl.push(MapPage);
    })
    // this.navCtrl.setRoot(TabsNavigationPage); 
    
  }

  loadGame(value:any){
    this.target.cat_id = value;
    this.target.cat_name = name;
    console.log('{menu} category id: ',this.target.cat_id);
    this.showLoadingGame();
    this.api.checkNumLevel(this.target.cat_id).subscribe(
      res => {
        this.target.numLev = res[0].numLev;  
        // this.target.lev_id = 1;
        console.log("{menu} Total Number of Levels: " , this.target.numLev);   
        this.api.loadGame(this.target.username,value).subscribe((res)=>{
          this.target.lev_id = res.lnum;
          this.target.setScore(parseInt(res.score));
          this.target.numLev = this.target.numLev - this.target.lev_id;
          console.log("Levels Remaining: ", this.target.numLev);
          console.log("current level: ", this.target.lev_id);
          console.log("current score: ", this.target.score);
          this.navCtrl.push(MapPage); 
      });      
    })




    // this.navCtrl.setRoot(TabsNavigationPage); 
    
  }



  resultPage(catId:any){
    this.createModal(catId);
    this.modalRs.present();
    // this.showAlert();
  }

  showLoadingGame() {
    if (!this.loading){
      this.loading = this.loadingCtrl.create({
      content: "Loading Game...",
      dismissOnPageChange : true
      });
      this.loading.present();
    
      } 
    }
  showLoadingCat() {
    if (!this.loading){
            this.loading = this.loadingCtrl.create({
        content: "Loading..."
        });
        this.loading.present();
    }

      }
  dismissLoading(){
    if (this.loading){
          this.loading.dismiss();
          this.loading = null;
    }

  }

  getData(type: any) {
    return this.cats[type];
  }

  showAlert() {
    if(!this.resAlert){
          this.resAlert = this.alertCtrl.create({
      title: 'Results Page',
      subTitle: 'Coming Soon',
      buttons: ['Dismiss']
    });
    }
    this.resAlert.present();
    this.resAlert.onDidDismiss(()=>{
      this.resAlert = null;
    })
  }

  createModal(catId:any){
    this.modalRs = this.modalCtrl.create(ResultsPage,{data: catId});  
  }

  openProfile(){
    this.navCtrl.push(ProfilePage);
  }
}
