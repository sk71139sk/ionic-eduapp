import { Component, NgZone,Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, Nav, Tab, Tabs, NavController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import 'rxjs/add/operator/filter';
import { NgIf } from '../../../node_modules/@angular/common';
import {ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map: any;
  // safeArea: any = 5;
  // testLat: any = -18.147871;
  // testLng: any = 178.443096;
  markers: any;
  autocomplete: any;
  google:any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  public watch: any;
  public lat: any;
  public lng: any;
  circle: any;
  checking: boolean;
  levFinished : boolean = false;
  // public score : any = 0;
  public alertScore : any;

  //alertGiven: boolean = false;
  // loading: any;
  // BtnContent : any;

  constructor(
    public zone: NgZone,
    public loadingController:LoadingController,
    private toastCtrl : ToastController,
    public geolocation: Geolocation,
    public api : ApiProvider,
    public target : TargetProvider,
    public navCtrl : NavController,
    public loadingCtrl: LoadingController,

    private alertCtrl: AlertController,
    public modalCtrl :ModalController,
    public backgroundGeolocation: BackgroundGeolocation
  ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    this.markers = [];

    let loader = this.loadingController.create({
      content: "Loading Game",
      duration: 2000
    });  
    loader.present();
    this.loadFirstLevel(this.target.cat_id);
  }

  ionViewDidEnter(){
    let initial:number = 0;
    localStorage.setItem('userScore', initial.toString() );
    this.loadMap();
    // console.log('values to be used for the circle: ',this.target.testLat,this.target.testLng)
    this.createCircle(this.target.testLat,this.target.testLng);
    this.createAndListen();
 
  }

  createAndListen(){

    google.maps.event.addListener(this.map, 'center_changed' , ()=>{
      if ((google.maps.geometry.spherical.computeDistanceBetween(/*new google.maps.LatLng(this.lat,this.lng)*/this.map.getCenter() ,this.circle.getCenter()) <= this.target.safeArea )&& (!this.target.alertGiven)/*&& (this.checking)*/){
        // let alert = this.alertCtrl.create({
        //   title: 'Level ' + this.target.lev_id + ' Appears',
        //   subTitle: 'You have found a question! Click Dismiss for the next Level',
        //   buttons: ['Dismiss']
        // });
        // alert.present();
        let modalQs = this.modalCtrl.create(ModalPage);

        modalQs.present();
        // let alertScore = this.alertCtrl.create({
        //   title: 'Score',
        //   subTitle: 'Score: '+  localStorage.getItem('score ') + ' '
        // })

        modalQs.onDidDismiss( ()=>{
          this.checkScore();
          // this.api.loadScore(this.target.answers.toLocaleString()).subscribe(
          //   res => {            
          //     console.log("this is score response: " , res.score);      
          //     // this.target.setScore(res.score); 
  
          //     localStorage.setItem('score',res.score );  //assign score to a variable
          //     console.log("this is score stored:", localStorage.getItem ('score'));
          //     this.alertScore = this.alertCtrl.create({
          //       title: 'Score',
          //       subTitle: 'Score: '+ res.score
          //     })
      
          //     this.alertScore.present();
          //     let temp:any = parseInt(localStorage.getItem('userScore')) +  parseInt(res.score)
          //     localStorage.setItem('userScore',temp ); 


      
          //   }
          // );
        }

        )

        this.target.alertGiven = true;
        this.levFinished = true;
       if (this.target.numLev  > 0 && this.levFinished){

        this.loadNextLevel();
        console.log("loadNextLevel happens");
      }
      else{
        console.log("game over");
        let endAlert = this.alertCtrl.create({
          title: 'Congratulations',
          subTitle: 'You have finished the game',
          buttons: ['Dismiss']
        });
          this.circle.setMap(null);
          if (this.target.gameOver ==  true) {
            endAlert.present();
          }
        }
      }
    });
  }

  loadMap(){
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-18.148540, 178.445526),
      zoom: 15,
      disableDefaultUI : true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  loadFirstLevel(value:any){
    this.api.getLevelCoords(value).subscribe(
      res => 
      {
        console.log('response received: ', res.lat,res.lng);
        console.log('{map} value passed: ', value);
        this.target.testLat = res.lat;
        this.target.testLng = res.lng;
        console.log('values assigned: ',this.target.testLat,this.target.testLng );
        this.target.numLev = this.target.numLev - 1;
        console.log('{map} levels remaining: ',this.target.numLev);
        this.circle.setCenter(new google.maps.LatLng(this.target.testLat,this.target.testLng));
    })
  }

  loadNextLevel(){
    this.api.loadNextLevel(this.target.lev_id,this.target.cat_id).subscribe(
      res => 
      {
      this.levFinished = false;

      console.log("Levels Remaining: ", this.target.numLev );
      console.log("Current Level: ", this.target.lev_id);
      this.target.testLat = res.lat;
      this.target.testLng = res.lng;

      this.target.alertGiven = false;
      this.circle.setCenter(new google.maps.LatLng(this.target.testLat,this.target.testLng));
    })

    this.createAndListen();
  }

  checkScore(){
          this.api.loadScore(this.target.answers.toLocaleString()).subscribe(
        res => {            
          console.log("this is score response: " , res.score);      
          // this.target.setScore(res.score); 

          localStorage.setItem('score',res.score );  //assign score to a variable
          console.log("this is score stored:", localStorage.getItem ('score'));
          this.alertScore = this.alertCtrl.create({
            title: 'Score',
            subTitle: 'Score: '+ res.score
          })

          this.alertScore.present();
          let temp:any = parseInt(localStorage.getItem('userScore')) +  parseInt(res.score)
          localStorage.setItem('userScore',temp ); 



        }
      );
  }



  tryGeolocation(){
    // this.loading.present();
    this.checking = true;
    this.startTracking();
    let toast = this.toastCtrl.create({
      message: "Tracking started",
      duration: 3000
    })
    toast.present();

  }

  stopGeo(){
    this.checking = false;
    this.stopTracking();
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

  selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        // let position = {
        //     lat: results[0].geometry.location.lat,
        //     lng: results[0].geometry.location.lng
        // };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          animation: google.maps.Animation.DROP, 
          map: this.map
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  startTracking() {
    // Background Tracking
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 10,
      distanceFilter: 10,
      debug: false,
      interval: 1000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

 
    // Foreground Tracking

    let options = {
      frequency: 1000, 
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      this.clearMarkers();
      // console.log("this map",this.map.getCenter().coords.latitude,this.map.getCenter().coords.longitude)
      console.log(position.coords.latitude,position.coords.longitude);
      this.map.setCenter(new google.maps.LatLng(this.lat,this.lng));

      let marker = new google.maps.Marker({
        position: this.map.center,
        map: this.map
      });
      this.markers.push(marker);
      // if(position.coords){
      //   let toast = this.toastCtrl.create({
      //     message: "Testing Location",
      //     duration: 8000,
      //     showCloseButton: true
      //   })
      //   toast.present();
      // }


      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    }, (err) => {

      console.log(err);

    });
   

    
  }

  stopTracking() {
    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
  //-18.148929, 178.444548

  createCircle(lat:any,lng:any){
    // Create marker 
  //   var marker = new google.maps.Marker({
  //   map: this.map,
  //   position: new google.maps.LatLng(lat,lng)
  // });
  //   marker.setVisible(false);
    var pos = new google.maps.LatLng(lat,lng)


  // Add circle overlay and bind to marker
    this.circle = new google.maps.Circle({
    map: this.map,
    radius: this.target.safeArea,    // in metres
    fillColor: '#0085a9',
    strokeOpacity: 0,
    center: pos
    });
    // this.circle.bindTo('center', marker, 'position');
    }
}
