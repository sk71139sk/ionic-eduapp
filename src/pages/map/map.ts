/* This is the main code page and contains the logic of all operations for the core of the game
    Due to team copyrights, the creator of the algorithms below has decided not to disclose the 
    comments to explain algorithms, rather only shows comments to show high level explanations of
    what goes on in the code. All rights reserved. Work of any outside author is mentioned and
     listed in details on the plugin folders by the authors themselvwes
*/

// Imports
import { Component, NgZone } from '@angular/core';
import { Vibration } from '@ionic-native/vibration';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, NavController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { ToastController, Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import 'rxjs/add/operator/filter';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import swal from 'sweetalert2';
import { MenuPage } from '../menu/menu';
import { ScoreboardPage } from '../scoreboard/scoreboard';

//declarations
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {
  //initial defintion before page load
  map: any;
  markers: any;
  backAlert: any;
  infoAlert: any;
  autocomplete: any;
  google: any;
  geocoder: any
  autocompleteItems: any;
  public watch: any;
  public lat: any;
  public lng: any;
  public circle: any;
  checking: boolean;
  levFinished: boolean = false;
  public alertScore: any;
  public loading :any;
  public modalQs: any;
  public modalSc:any;
  public endAlert: any;
  public circle1: any;
  public circle2: any;
  public marker:any;
  public marker1:any;
  public marker2:any;
  public coco1 : any;
  public coco2 : any;
  public coco3 : any;
  public buttonShown: any = 'hidden';


  constructor(
    //constructor for variable definitions
    private vibration: Vibration,
    public zone: NgZone,
    public event: Events,
    public loadingController: LoadingController,
    private toastCtrl: ToastController,
    public geolocation: Geolocation,
    public api: ApiProvider,
    public target: TargetProvider,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,

    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public backgroundGeolocation: BackgroundGeolocation
  ) {
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
    this.target.alertGiven = false;
    this.target.dummy1given = false;
    this.target.dummy2given = false;
    this.target.quesFound = false;
    let initial: number = 0;

    //check user score in the storage and reset it
    //this is used as a measure incase of network issue
    if (localStorage.getItem('userScore')) {
      localStorage.setItem('userScore', '0');
    }
  }

  //loading of components on page load
  ionViewDidEnter() {

    // listen to the Game Over event
    this.target.event.subscribe('GameOver',(dataSend)=>{      
      if (dataSend == true){
        this.end();   
      }else if(dataSend == false){
        this.endTime();   
      }  
    }) 

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // cocnut listeners for coconut events
    this.target.event.subscribe('coco1False',()=>{
      this.coco1.setIcon({
        url: 'assets/img/rock.png',
        scaledSize: new google.maps.Size(50,50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(19,50)
      })
    })

    this.target.event.subscribe('coco2False',()=>{
      this.coco2.setIcon({
        url: 'assets/img/rock.png',
        scaledSize: new google.maps.Size(50,50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(19,50)
      })
    })

    this.target.event.subscribe('coco3False',()=>{
      this.coco3.setIcon({
        url: 'assets/img/rock.png',
        scaledSize: new google.maps.Size(50,50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(19,50)
      })
    })

    this.target.event.subscribe('coco1True',()=>{
      this.coco1.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
    })

    this.target.event.subscribe('coco2True',()=>{
      this.coco2.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
    })

    this.target.event.subscribe('coco3True',()=>{
      this.coco3.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
    })
    this.target.event.subscribe('coconuts',()=>{
      this.coco1.setPosition(this.target.coco1_coord);
      this.coco1.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
      this.coco2.setPosition(this.target.coco2_coord);
      this.coco2.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
      this.coco3.setPosition(this.target.coco3_coord);
      this.coco3.setIcon({
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      })
    })
    this.target.event.subscribe('cocoRefresh',()=>{
      this.coco1.setPosition(this.target.coco1_coord);
      this.coco2.setPosition(this.target.coco2_coord);
      this.coco3.setPosition(this.target.coco3_coord);
    })
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------



    // initial load of operations
    this.loadMap();
    this.create1stDummyCircle();
    this.create2ndDummyCircle();
    this.loadNextLevel();
    this.createModalQs();
    this.createCircle(this.target.testLat, this.target.testLng);

    //create coconuts in the view
    this.createCoco1();
    this.createCoco2();
    this.createCoco3();
    this.api.refresh().subscribe(
      e=>{
          this.target.coco1 = e.coco1;
          if (this.target.coco1 == true){
            this.target.event.publish('coco1True');
          }
          else{
            this.target.event.publish('coco1False');
          }
          this.target.coco2 = e.coco2;
          if (this.target.coco2 == true){
            this.target.event.publish('coco2True');
          }
          else{
            this.target.event.publish('coco2False');            
          }
          this.target.coco3 = e.coco3;
          if (this.target.coco3 == true){
            this.target.event.publish('coco3True');
          }
          else{
            this.target.event.publish('coco3False');            
          }
          this.target.setCoords(e.lat1,e.lng1,e.lat2,e.lng2,e.lat3,e.lng3);
      }
  );
  //call the main listener function
    this.createAndListen();
  }

  //this function has listeners for all movement events of the user
  createAndListen() {

    //listener for coconut 1
    google.maps.event.addListener(this.map, 'center_changed',()=>{
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */
      , this.target.coco1_coord) <= this.target.safeArea) && (this.target.coco1)&& (this.checking)) {
        this.stopGeo();
        this.vibration.vibrate(2000);
        this.animateCoco(this.target.cocoPoints);
        setTimeout(()=>{
          this.target.event.publish('coco1False');
          this.target.setCoconuts(this.target.cocoPoints);
        },2500)
        this.api.visit('coco1').subscribe();
        this.target.coco1 = false;

      }
    })

    //listener for coconut 2
    google.maps.event.addListener(this.map, 'center_changed',()=>{
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */
      , this.target.coco2_coord) <= this.target.safeArea) && (this.target.coco2)&& (this.checking)) {
        this.stopGeo();
        this.vibration.vibrate(2000);
        this.animateCoco(this.target.cocoPoints);
        setTimeout(()=>{
          this.target.event.publish('coco2False');
          this.target.setCoconuts(this.target.cocoPoints);
        },2500)
        this.api.visit('coco2').subscribe();
        this.target.coco2 = false;

      }
    })

    //listener for coconut 3
    google.maps.event.addListener(this.map, 'center_changed',()=>{
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */
      , this.target.coco3_coord) <= this.target.safeArea) && (this.target.coco3)&& (this.checking)) {
        this.stopGeo();
        this.vibration.vibrate(2000);
        this.animateCoco(this.target.cocoPoints);
        setTimeout(()=>{
          this.target.event.publish('coco3False');
          this.target.setCoconuts(this.target.cocoPoints);
        },2500)
        this.api.visit('coco3').subscribe();
        this.target.coco3 = false;

      }
    })

    //listener for dummy 1
    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */
        , this.circle1.getCenter()) <= this.target.safeArea) && (!this.target.dummy1given) && (!this.target.quesFound)&& (this.checking)) {

        this.stopGeo();
        this.vibration.vibrate([1000,500,1000]);
        this.target.numcircles--;
        if (this.target.numcircles == 1){
          this.buttonShown = 'hidden';
        }
        let dummyAlert = this.alertCtrl.create(
          {
            title: 'Oooops',
            message: 'Sorry Try Another Location!'
          }
        )
        this.marker1.setIcon({
          url: 'assets/img/oops.gif',
          scaledSize: new google.maps.Size(10, 10,'vh','vh')
        });
        setTimeout(()=>{
          dummyAlert.present();

          this.circle1.setCenter(this.target.coord_Default);
          this.marker1.setIcon({
            url: 'assets/img/leaves.gif',
            scaledSize: new google.maps.Size(5, 5,'vh','vh')
          })
        },1000)
        this.target.dummy1given = true;

      }
    });

    //listener for dummy 2
    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */,
        this.circle2.getCenter()) <= this.target.safeArea) && (!this.target.dummy2given) && (!this.target.quesFound)&& (this.checking)) {

        this.stopGeo();
        this.vibration.vibrate([1000,500,1000]);
        this.target.numcircles--;
        if (this.target.numcircles == 1){
          this.buttonShown = 'hidden';
        }
        let dummyAlert2 = this.alertCtrl.create(
          {
            title: 'Oooops',
            message: 'Sorry Try Another Location!'
          }
        )
        this.marker2.setIcon({
          url: 'assets/img/oops.gif',
          scaledSize: new google.maps.Size(10, 10,'vh','vh')
        });
        setTimeout(()=>{
          dummyAlert2.present();
          this.circle2.setCenter(this.target.coord_Default);
          this.marker2.setIcon({
            url: 'assets/img/leaves.gif',
            scaledSize: new google.maps.Size(5, 5,'vh','vh')
          })
          },1000)
          this.target.dummy2given = true;
      }
    });

    // main listener
    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.lat,this.lng)/* this.map.getCenter() */,
        this.circle.getCenter()) <= this.target.safeArea) && (!this.target.alertGiven)&& (this.checking)) {
        this.stopGeo();
        this.vibration.vibrate(2000);
        this.marker.setIcon({
          url: 'assets/img/sparks.gif',
          scaledSize: new google.maps.Size(15, 15,'vh','vh')
        });
        setTimeout(()=>{
          this.marker.setIcon({
            url: 'assets/img/bure.png',
            scaledSize: new google.maps.Size(15, 15,'vh','vh')
          });
          setTimeout(()=>{
            //present the questions in a view
            this.modalQs.present();
          },1500)
        },1000)
        this.target.alertGiven = true;
        this.target.quesFound = true;
        this.circle1.setCenter(this.target.coord_Default);
        this.circle2.setCenter(this.target.coord_Default);
        this.modalQs.onDidDismiss(() => {
          this.marker.setIcon({
            url: 'assets/img/leaves.gif',
            scaledSize: new google.maps.Size(5, 5,'vh','vh')
          })
          this.checkScore();
        })
        this.levFinished = true;
        if (this.target.numLev > 0 && this.levFinished) {
            this.event.subscribe('loadNext',(data)=>{
              if (data == true){
                this.loadNextLevel();
                console.log("loadNextLevel happens");
              }
            }) 
        }
      }
    });
  }

  //load the map and set zoom, styles and center
  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-18.148540, 178.445526),
      zoom: 18,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      clickableIcons: false,
      styles : [ { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] },
        { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },
        { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
        { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
        { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] },
        { "featureType": "administrative", "elementType": "geometry", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] },
        { "featureType": "administrative.neighborhood", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "landscape", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [ { "color": "#004040" },
        { "visibility": "on" }, { "weight": 1 } ] }, { "featureType": "landscape.natural", "stylers": [ { "color": "#008040" } ] },
        { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [ { "color": "#004000" }, { "visibility": "simplified" } ] },
        { "featureType": "poi", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
        { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
        { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
        { "featureType": "road", "stylers": [ { "color": "#004040" } ] },
        { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] },
        { "featureType": "road", "elementType": "geometry.fill", "stylers": [ { "color": "#444444" } ] },
        { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#626262" },
        { "visibility": "on" } ] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] },
        { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
        { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
        { "featureType": "transit", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
        { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
        { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#0000ff" },
        { "lightness": 30 } ] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] } ]
    });
  }

  //load the first level and set parameters
  loadFirstLevel(value: any) {
    this.target.lev_id = this.target.lev_id + 1;
    this.target.numLev = this.target.numLev - 1;
    this.api.getLevelCoords(value).subscribe(
      res => {
        console.log('response received: ', res.lat, res.lng);
        console.log('{map} value passed: ', value);
        this.target.testLat = res.lat;
        this.target.testLng = res.lng;
        console.log('values assigned: ', this.target.testLat, this.target.testLng);

        console.log('{map} levels remaining: ', this.target.numLev);
        this.circle.setCenter(new google.maps.LatLng(this.target.testLat, this.target.testLng));
        this.target.quesFound = false;
      })
  }

  //load next level given current level number
  loadNextLevel() {
    console.log("the current level is ", this.target.lev_id);
    console.log("the current score is: ",this.target.score);
    this.showLoading();
    //check how many hints to show depending on score given
    if (this.target.numcircles == 2){
      console.log("numcircle = ", this.target.numcircles);
          this.api.getOneRandomCoords().subscribe(
            res => {
              this.createDummyCircle(res.lat, res.lng);
              this.buttonShown = 'visible';
            }
          );
    }
    else if (this.target.numcircles == 3){
      console.log("numcircle = ", this.target.numcircles);
      this.api.getTwoRandomCoords().subscribe(
        res => {
          this.createDummyCircle(res[0].lat, res[0].lng);
          this.createAnotherDummyCircles(res[1].lat, res[1].lng);
          this.buttonShown = 'visible';
        }
      );
    }
    this.api.loadLevel(this.target.cat_id, (this.target.lev_id + 1) , this.target.username, this.target.score).subscribe(
      res => {
        this.target.testLat = res.lat;
        this.target.testLng = res.lng;
        this.levFinished = false;
        console.log("Levels Remaining: ", this.target.numLev);
        console.log("Loading Level: ", (this.target.lev_id + 1));
        console.log('response received for Level ', (this.target.lev_id + 1), ': ', res.lat, res.lng);
        this.target.alertGiven = false;
        this.target.quesFound = false;
        this.dismissLoading();
        this.circle.setCenter(new google.maps.LatLng(this.target.testLat, this.target.testLng));        
      })
    //re-iterate the listeners 
    this.createAndListen();
  }

  createDummyCircle(lat: any, lng: any) {
    this.circle1.setCenter(new google.maps.LatLng(lat, lng));
    console.log("set a new dummy at: " + lat, lng);
    this.target.dummy1given = false;
  }

  createAnotherDummyCircles(lat: any, lng: any) {
    this.circle2.setCenter(new google.maps.LatLng(lat, lng));
    console.log("set a new dummy at: " + lat, lng);
    this.target.dummy2given = false;
  }



  checkScore() {
    this.api.loadScore(this.target.cat_id, this.target.lev_id, this.target.question.toLocaleString(),this.target.answers.toLocaleString()).subscribe(
      res => {
        console.log("check Score is called in Level " + this.target.lev_id);
        console.log("this is score response: ", res.score);
        //assign score to a variable
        console.log("this is score stored:", localStorage.getItem('score'));
        swal({
          //show the score in a sweet alert
          title: 'Score',
          html: '<h2> Coins Earned: '+ res.score +' </h2> <p> <img height="100px" src="assets/img/coin.gif"> </img> </p>',
          type: 'success'
        }).then(()=>{
          //animate coins that are awarded
          this.animateCoin(parseInt(res.score));
            this.target.setScore(parseInt(res.score));
            console.log("score: "+ this.target.score);         
          console.log("Current Level for this score: ", this.target.lev_id);
          console.log("Levels Remaining after showing score: ", this.target.numLev);
          //check how mnay levels remain
          if (this.target.numLev == 0) {
            //game over
            console.log("published game over");
            this.circle.setMap(null);
            let dataSend :any = true;
            this.target.event.publish('GameOver',dataSend );
          }
          else{
            //next level
              let data = true;
              this.event.publish('loadNext',data);
          }
        });
        //assess score and establish game rules for displaying hints
        if (res.percentage == 100) {
          this.target.numcircles = 1;
        }
        else if (res.percentage > 50) {
          this.target.numcircles = 2;
         }
        else {
          this.target.numcircles = 3;
        }
        if (this.target.numcircles == 1){
          this.buttonShown = 'hidden';
        }
        let temp: any = parseInt(localStorage.getItem('userScore')) + parseInt(res.score)
        localStorage.setItem('userScore', temp);
      }
    );
    //clear the answers array to get it ready for next level
    this.target.answers.length = 0;
  }

  //check location of user
  tryGeolocation() {
    this.checking = true;
    this.startTracking();
    let toast = this.toastCtrl.create({
      message: "Tracking started",
      duration: 3000
    })
    toast.present();
  }

  //stop checking location
  stopGeo() {
    this.checking = false;
    this.stopTracking();
  }

  //clear array of markers stored while traversing map and showing movement
  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------
  /* This is included in the ionic geolocation plugin, and is used for development purposes only as approved under the Open Source Licence
     Any commercial means should be discussed with the author of the plugin as described on the plugin folder where teh plguin is defined.
     All Rights Reserved
  */

  //start geolocation service
  startTracking() {
    // Background Tracking
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 5,
      distanceFilter: 5,
      debug: false,
      interval: 500
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
      frequency: 500,
      enableHighAccuracy: true
    };
    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      this.clearMarkers();
      // console.log("this map",this.map.getCenter().coords.latitude,this.map.getCenter().coords.longitude)
      this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
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

  // ----------------------------------------------------End of Plugin Section ------------------------------------------------------------------------------


  /*  Hints are made at startup and assigned the location South-Pole by default, these are
  *   moved around to the campus during the game as needed and shifted back. This is a limitation of Google Maps plugin
  *   As it does not allow creating shapes once map has loaded.
  */

  //create main hint where the bure/question appears
  createCircle(lat: any, lng: any) {

    var pos = new google.maps.LatLng(lat, lng);

    // Add circle overlay and bind to marker
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.target.safeArea,    // in metres
      fillColor: '#0085a9',
      fillOpacity: 0,
      strokeColor: '#0085a9',
      strokeWeight: 2,
      strokeOpacity: 0,
      center: pos
    });
    this. marker = new google.maps.Marker({
      position : pos,
      map: this.map,
      icon: {
        url: 'assets/img/leaves.gif',
        scaledSize: new google.maps.Size(5, 5,'vh','vh')
      }
    });
    this.circle.bindTo('center', this.marker, 'position');
  }

  //create the dummy hint
  create1stDummyCircle() {

    var pos = this.target.coord_Default;

    // Add circle overlay and bind to marker
    this.circle1 = new google.maps.Circle({
      map: this.map,
      radius: this.target.safeArea,    // in metres
      fillColor: '#0085a9',
      fillOpacity: 0,
      strokeColor: '#0085a9',
      strokeWeight: 2,
      strokeOpacity: 0,
      center: pos
    });

    this. marker1 = new google.maps.Marker({
      position : pos,
      map: this.map,
      optimized: false,
      icon: {
        url: 'assets/img/leaves.gif',
        scaledSize: new google.maps.Size(5, 5,'vh','vh')
      }
    });
    // this.animateCircle(this.circle1);
    this.circle1.bindTo('center', this.marker1, 'position');
  }

  //create the second dummy hint
  create2ndDummyCircle() {

    var pos = this.target.coord_Default;

    // Add circle overlay and bind to marker
    this.circle2 = new google.maps.Circle({
      map: this.map,
      radius: this.target.safeArea,    // in metres
      fillColor: '#0085a9',
      fillOpacity: 0,
      strokeColor: '#0085a9',
      strokeWeight: 2,
      strokeOpacity: 0,
      center: pos
    });

    this. marker2 = new google.maps.Marker({
      position : pos,
      map: this.map,
      optimized: false,
      icon: {
        url: 'assets/img/leaves.gif',
        scaledSize: new google.maps.Size(5, 5,'vh','vh')
      }
    });  
    this.circle2.bindTo('center', this.marker2, 'position');
  }

  //create coconut tree 1
  createCoco1(){
    var pos = this.target.coco1_coord; 

    this.coco1 = new google.maps.Marker({
      position : pos,
      map: this.map,
      optimized: false,
      icon: {
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      }
    });
  }

  //create coconut tree 2
  createCoco2(){
    var pos = this.target.coco2_coord; 

    this.coco2 = new google.maps.Marker({
      position : pos,
      map: this.map,
      optimized: false,
      icon: {
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      }
    });
  }

  //create coconut tree 3
  createCoco3(){
    var pos = this.target.coco3_coord; 

    this.coco3 = new google.maps.Marker({
      position : pos,
      map: this.map,
      optimized: false,
      icon: {
        url: 'assets/img/coco.gif',
        scaledSize: new google.maps.Size(100,100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(56,100)
      }
    });
  }

/*   animation of shapes (future implementations)
    - not part of this build - commented out
*/


  // animateCircle(circleP: any) {
  //   var num = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
  //   var num2 = Math.floor(Math.random() * (3000 - 1000 + 1000)) + 1000;
  //   var timer = 50;
  //   var seen = true;
  //   var direction = 0.25;
  //   var rMin = 0, rMax = this.target.safeArea;
  //   setInterval(() => {
  //     var radius = circleP.getRadius();

  //     if (!seen) {
  //       setTimeout(() => {
  //         if (radius == rMin) {
  //           seen = true;
  //           circleP.setVisible(true);
  //         }
  //       }, num2);
  //     }

  //     if ((radius > rMax) || (radius < rMin)) {
  //       direction *= -1;
  //     }
  //     if ((radius == rMin)) {
  //       circleP.setVisible(false);
  //       seen = false;
  //     }
  //     circleP.setRadius(radius + direction * num / 2);
  //   },
  //     timer
  //   );
  // }

  //old implementation of alert for version control and future reviews
  createEndAlert() {
    if(!this.endAlert){
          this.endAlert = this.alertCtrl.create({
      title: 'Congratulations',
      subTitle: 'You have finished the game',
      buttons: ['Dismiss']
    });
    console.log("endalert created");
    }
    this.endAlert.present();
    this.endAlert.onDidDismiss(()=>{
      this.navCtrl.pop();
    })
  }

  //present this alert when game is completed
  end(){
    this.api.endGame(this.target.username, this.target.cat_id, this.target.lev_id, this.target.score).subscribe();
    swal({ 
      title: "Congratulations",  
       html: '<h2> Game Complete, You earned '+ this.target.score + ' points</h2>  <p> <img height="100px" src="assets/img/points.gif"> </img> </p>'
      }).then(()=>
    {
      this.target.setPoints(this.target.score);
      this.navCtrl.setRoot(MenuPage);
      this.target.cat_id = 0;
    })
  }

  //present this alert when coordinator ends game 
  endTime(){
    this.api.endGame(this.target.username, this.target.cat_id, this.target.lev_id, this.target.score).subscribe();
    swal({ 
      title: "OOPS",  
       html: '<h2> Game Has Ended. The Coordinator has ended the Game, You earned '+ this.target.score + ' points</h2>  <p> <img height="100px" src="assets/img/points.gif"> </img> </p>',
       type: 'error'
      }).then(()=>
    {
      this.target.setPoints(this.target.score);
      this.navCtrl.setRoot(MenuPage);
      this.target.cat_id = 0;
    })
  }

  //create questions view
  createModalQs() {
    this.modalQs = this.modalCtrl.create(ModalPage);
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
    if (this.loading){
          this.loading.dismiss();
          this.loading = null;
    }
  }

  //animate coin with JavaScript DOM and CSS
  animateCoin(score:number){
    if (score > 10){
      score = 10;
    }
    let obj = document.getElementById('coin');
    obj.id = 'coin-animated';
    score = score/4;
    setTimeout(()=>{
      obj.id = 'coin';
    },(score*1000)
    )
  }
  //animate coconuts with JavaScript DOM and CSS
  animateCoco(score:number){
    if (score > 10){
      score = 10;
    }
    let obj = document.getElementById('coco');
    obj.id = 'coco-animated';
    score = score/4;
    setTimeout(()=>{
      obj.id = 'coco';
    },(score*1000)
    )
  }

  //message box for closing a game
  backButton(){
    console.log("inside backbutton");
    this.backAlert = this.alertCtrl.create({
      title: 'Quit Game?',
      message: 'Do you want to close this game?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
              console.log('Application exit prevented!');
          }
      },{
          text: 'Close Game',
          handler: () => {
              this.navCtrl.setRoot(MenuPage);
          }
      }]
  });
  this.backAlert.present();
  }


  //scoreboard view 
  infoButton(){
    this.modalSc = this.modalCtrl.create(ScoreboardPage);
    this.modalSc.present();
  }

  //eremove dummy hints view creator
  removeDummies(){
    swal({
      title: 'Are You Sure?',
      html: '<h2> Removing dummy hints will use 200 coconuts! </h2>',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        if(this.target.coconuts >= 200){
            this.buttonShown = 'hidden';
            this.target.setCoconuts(-(this.target.cocoExpense));
            if (this.target.numcircles == 2){
              this.circle1.setCenter(this.target.coord_Default);
              console.log("removed dummy");
              this.api.updateCoco().subscribe();
            }
            else if(this.target.numcircles == 3)
            this.circle1.setCenter(this.target.coord_Default);
            this.circle2.setCenter(this.target.coord_Default);
            console.log("removed dummies");
            this.api.updateCoco().subscribe();
        }
        else{
          swal({
            title: 'Ooops',
            html: '<h2> You Do Not Have enough Coconuts </h2>',
            type: 'error'
          })
        }
      }
      })
    }
  
}
