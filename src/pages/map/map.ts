import { Component, NgZone,Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, Nav, Tab, Tabs } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/filter';

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
  //alertGiven: boolean = false;
  // loading: any;
  // BtnContent : any;

  constructor(
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
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    this.markers = [];
    // this.loading = this.loadingCtrl.create();
  }

  ionViewDidEnter(){
      // let infoWindow = new google.maps.InfoWindow({map: map});
      //Set latitude and longitude of some place

    // this.BtnContent = "Check";

    // this.zone.run(() => {
    //   this.map = new google.maps.Map(document.getElementById('map'), {
    //     center: new google.maps.LatLng(-18.148540, 178.445526),
    //     zoom: 20,
    //     disableDefaultUI : true,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   });
    // });
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-18.148540, 178.445526),
      zoom: 20,
      disableDefaultUI : true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

      this.createCircle(this.target.testLat,this.target.testLng);
  
      // this.createCircle(-18.147997, 178.443251);
      
      // this.createCircle(-18.149582, 178.446138);

      // google.maps.event.clearListeners(this.circle,'dragend');
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
      //   if (this.circle.getBounds().contains(this.map.getCenter().LatLng)){
      //             let toast2 = this.toastCtrl.create({
      //     message: "Question appears here",
      //     duration: 8000,
      //     showCloseButton: true                      
      //   })
      //   toast2.present();
      //   console.log("toast appears");
      //   }


      });
        
      
      //  google.maps.event.clearListeners(this.circle, 'mouseout');
      

      // // Bounds for North America
      // var strictBounds = new google.maps.LatLngBounds(
      //   new google.maps.LatLng(-18.155848, 178.438287),
      //   new google.maps.LatLng(-18.146352, 178.449348));

      // // Listen for the dragend event
      // google.maps.event.addListener(this.map, 'dragend', function () {
      //     if (strictBounds.contains(this.map.getCenter())) return;

      //     // We're out of bounds - Move the map back within the bounds

      //     var c = this.map.getCenter(),
      //         x = c.lng(),
      //         y = c.lat(),
      //         maxX = strictBounds.getNorthEast().lng(),
      //         maxY = strictBounds.getNorthEast().lat(),
      //         minX = strictBounds.getSouthWest().lng(),
      //         minY = strictBounds.getSouthWest().lat();

      //     if (x < minX) x = minX;
      //     if (x > maxX) x = maxX;
      //     if (y < minY) y = minY;
      //     if (y > maxY) y = maxY;

      //     this.map.setCenter(new google.maps.LatLng(y, x));
      // });
    
  }

  //  // Limit the zoom level
  //  google.maps.event.addListener(map, 'zoom_changed', function () {
  //      if (this.map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
  //  });
  //   }

  tryGeolocation(){
    // this.loading.present();
    this.checking = true;
    this.startTracking();
    let toast = this.toastCtrl.create({
      message: "Tracking started",
      duration: 3000
    })
    toast.present();
 


    // let location = new google.maps.Point(-18.147874, 178.443069);
    // let myLocation = (google.maps.Point) this.geolocation.getCurrentPosition();
    // if 

    //remove previous markers 
    // this.BtnContent = "Checking";
    

    // this.geolocation.getCurrentPosition().then((resp) => {
      // let pos = {
      //   lat: ,
      //   lng: 
      // };



    


      // this.loading.dismiss();


    // }).catch((error) => {
    //   console.log('Error getting location', error);
    //   this.loading.dismiss();
    // });
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
