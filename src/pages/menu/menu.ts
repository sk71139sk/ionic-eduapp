// imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import{ ApiProvider } from '../../providers/api/api'
import { TargetProvider } from '../../providers/target/target';
import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import {ProfilePage} from '../profile/profile';
import swal from 'sweetalert2';
import {MapPage} from '../map/map';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 //declarations
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
}) 

export class MenuPage {
  public loading: Loading;
  public resAlert :any;

  //array containers of data 
  categories : any[];
  modalRs: any;

  //container for selector value of segments
  catType : any = 'All';

  //an object contains the values as form of arrays (array inside object)
  cats : any ={
    All : [],
    Saved: [],
    Completed : []
  }

  constructor(
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    public modalCtrl : ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public target: TargetProvider, 
    public api : ApiProvider, 
    public navParams: NavParams) 
    {
      // Load all data
      this.init();
 
    }

  ionViewDidLoad() {}

  /* This function loads all user data for the profile page, including the profile photo from the database */
  init(){
    this.loadCat();
    this.api.getUserData().subscribe(
      (res)=>{
        this.target.points = res.points;
        this.target.coconuts = res.coconuts;
        this.target.firstName = res.fName;
        this.target.lastName = res.lName;
        if(res.photo != null){
          this.target.setPhoto(res.photo);
        }else{
          this.target.setPhoto(this.target.defaultPhoto);
        }
      }
    );
  }

  // This function refreshes the page and the data of teh user profile
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.init();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  //this function loads all categories through Api calls
  loadCat(){
    //loader is shown
    this.showLoadingCat();

    //get all new games
    this.api.getCategories2(this.target.username).subscribe(
      res => {
        this.cats.All = res;
      })

      //get all saved games
    this.api.getSavedCategories(this.target.username).subscribe(
      res => {
          this.cats.Saved = res;
      })

    // get all completed games
    this.api.getCompCategories(this.target.username).subscribe(
      res => {
          this.cats.Completed = res;
      })

      //hide loading
      this.dismissLoading();
  }

  //click event to handle starting of new Game
  startGame(value:any,name:any){
    this.target.cat_id = value;
    this.target.cat_name = name;
    console.log('{menu} category id: ',this.target.cat_id);
    console.log('{menu} NUM: ', this.target.numcircles);
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
  }

  //click event to handle loading a saved game
  loadGame(value:any,name:any,num:any){
    this.target.cat_id = value;
    this.target.cat_name = name;
    console.log('{menu} category id: ',this.target.cat_id);
    console.log('{menu} NUM: ', this.target.numcircles);
    this.showLoadingGame();
    this.api.checkNumLevel(this.target.cat_id).subscribe(
      res => {
        this.target.numLev = res[0].numLev;  
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
  }


  //load the resuts page
  resultPage(catId:any){
    this.createModal(catId);
    this.modalRs.present();
  }

  //loader function declaration
  showLoadingGame() {
    if (!this.loading){
      this.loading = this.loadingCtrl.create({
      content: "Loading Game...",
      dismissOnPageChange : true
      });
      this.loading.present();    
      } 
    }

  //loader call
  showLoadingCat() {
    if (!this.loading){
            this.loading = this.loadingCtrl.create({
        content: "Loading..."
        });
        this.loading.present();
    }
  }

  //loader hide
  dismissLoading(){
    if (this.loading){
          this.loading.dismiss();
          this.loading = null;
    }
  }

  // get data of all games 
  getData(type: any) {
    return this.cats[type];
  }

  //delete confirmation of saved games
  deleteSavedPrompt(cat_id:any,cat_name:any){
    swal({
      title: 'Are You Sure?',
      html: '<h2> You will lose all saved progress from '+ cat_name +'! </h2>',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.removeSavedGame(cat_id);
      }
    })
  }

  //remove a saved game
  removeSavedGame(catId: any){
    this.api.removeSaved(catId).subscribe(
      (res)=>{
        this.loadCat();
        location.reload();
      }
    );
  }

  //create the results page and pass data
  createModal(catId:any){
    this.modalRs = this.modalCtrl.create(ResultsPage,{data: catId});  
  }

  //open profile page
  openProfile(){
    this.navCtrl.push(ProfilePage);
  }
}
