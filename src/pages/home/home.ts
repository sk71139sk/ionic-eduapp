// import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Component, NgZone,Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, Nav, Tab, Tabs } from 'ionic-angular';
 import { TargetProvider } from '../../providers/target/target';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
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

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    private toastCtrl : ToastController,
    public geolocation: Geolocation,
     public target : TargetProvider, 
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public backgroundGeolocation: BackgroundGeolocation
  ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.markers = [];
    // this.loading = this.loadingCtrl.create();
  }

  ionViewDidEnter(){

    this.map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-18.148540, 178.445526),
    zoom: 20,
    disableDefaultUI : true,
    mapTypeId: google.maps.MapTypeId.ROADMAP

  });

    this.createCircle(this.target.testLat,this.target.testLng);

    google.maps.event.addListener(this.map, 'center_changed' , ()=>{
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng) ,this.circle.getCenter()) <= this.target.safeArea )&& (!this.target.alertGiven)&& (this.checking)){
        let alert = this.alertCtrl.create({
          title: 'Congratulations',
          subTitle: 'You have found a question!',
          buttons: ['Dismiss']
        });
        alert.present();
        this.target.alertGiven = true;
        console.log("alert appears");
      }
    });
  }



  //------------------------------------------------------------------------------------------------------------------------------------
  //functions called are below

  tryGeolocation(){
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
    //define the center of circle as a point
    var pos = new google.maps.LatLng(lat,lng)

  // Add circle overlay and bind to marker
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.target.safeArea,    // in metres
      fillColor: '#0085a9',
      strokeOpacity: 0,
      center: pos
      });
    }

}
