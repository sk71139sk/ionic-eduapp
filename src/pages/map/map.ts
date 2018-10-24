import { Component, NgZone } from '@angular/core';
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
  google: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  public watch: any;
  public lat: any;
  public lng: any;
  public circle: any;
  checking: boolean;
  levFinished: boolean = false;
  // public score : any = 0;
  public alertScore: any;
  public loading :any;
  public modalQs: any;
  public endAlert: any;
  public numcircles: number = null;
  public circle1: any;
  public circle2: any;

  //alertGiven: boolean = false;
  // loading: any;
  // BtnContent : any;

  constructor(
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
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    this.markers = [];

    this.target.alertGiven = false;
    this.target.dummy1given = false;
    this.target.dummy2given = false;
    this.target.quesFound = false;
    // this.loadFirstLevel(this.target.cat_id);
    // this.loadNextLevel();
    let initial: number = 0;
    // let data: any = false;


    // this.event.publish('GameOver', data);

    //localStorage.setItem('userScore', initial.toString() );
    if (localStorage.getItem('userScore')) {
      localStorage.setItem('userScore', '0');
      // console.log("works");
    }

  }

  ionViewDidEnter() {
    this.target.event.subscribe('GameOver',()=>{      
        this.end();     
    }) 

    this.loadMap();
    // this.loadFirstLevel(this.target.cat_id);
    this.loadNextLevel();
    // this.createEndAlert();
    this.createModalQs();
    // console.log('values to be used for the circle: ',this.target.testLat,this.target.testLng)
    this.createCircle(this.target.testLat, this.target.testLng);
    this.create1stDummyCircle();
    this.create2ndDummyCircle();
    this.createAndListen();

  }

  createAndListen() {

    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(/* new google.maps.LatLng(this.lat,this.lng) */this.map.getCenter()
        , this.circle1.getCenter()) <= this.target.safeArea) && (!this.target.dummy1given) && (!this.target.quesFound)/* && (this.checking) */) {
        // this.stopGeo();
        let dummyAlert = this.alertCtrl.create(
          {
            title: 'Oooops',
            message: 'Sorry Try Another Location!'
          }
        )
        dummyAlert.present();
        this.target.dummy1given = true;
        this.circle1.setCenter(this.target.coord_Default);
      }
    });

    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(/* new google.maps.LatLng(this.lat,this.lng) */this.map.getCenter(),
        this.circle2.getCenter()) <= this.target.safeArea) && (!this.target.dummy2given) && (!this.target.quesFound)/* && (this.checking) */) {
        // this.stopGeo();
        let dummyAlert2 = this.alertCtrl.create(
          {
            title: 'Oooops',
            message: 'Sorry Try Another Location!'
          }
        )
        dummyAlert2.present();
        this.target.dummy2given = true;
        this.circle2.setCenter(this.target.coord_Default);
      }
    });

    // main listener
    google.maps.event.addListener(this.map, 'center_changed', () => {
      if ((google.maps.geometry.spherical.computeDistanceBetween(/* new google.maps.LatLng(this.lat,this.lng) */this.map.getCenter(),
        this.circle.getCenter()) <= this.target.safeArea) && (!this.target.alertGiven)/* && (this.checking) */) {
        // this.stopGeo();

        this.modalQs.present();
        this.target.alertGiven = true;
        this.target.quesFound = true;
        this.circle1.setCenter(this.target.coord_Default);
        this.circle2.setCenter(this.target.coord_Default);
        this.modalQs.onDidDismiss(() => {

          this.map.setZoom(16);
          this.map.setCenter(new google.maps.LatLng(-18.148540, 178.445526));
          this.checkScore();
          // if (this.target.numLev > 0 ){


          // }

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
        // else {
        //   this.circle.setMap(null);
        //   this.event.subscribe('GameOver', () => {
        //       console.log("Received Game Over")
        //       this.api.endGame(this.target.username, this.target.cat_id, this.target.lev_id, this.target.score).subscribe();
        //       this.createEndAlert();
        //       // this.endAlert.onDidDismiss(() => {

        //       //   document.location.href = 'index.html';
        //       //   // this.navCtrl.popToRoot();
        //       //   // this.target.alertGiven = false;
        //       // })
        //       // this.loadMap();
            

        //   })
        // }
      }
    });
  }

  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-18.148540, 178.445526),
      zoom: 18,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      tilt: 45
    });
  }

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

  loadNextLevel() {

    // this.api.loadNextLevel(this.target.lev_id,this.target.cat_id).subscribe(
    console.log("the current level is ", this.target.lev_id);
    console.log("the current score is: ",this.target.score);
    this.showLoading();
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
    this.api.loadScore(this.target.cat_id, this.target.lev_id, this.target.answers.toLocaleString()).subscribe(
      res => {
        console.log("check Score is called in Level " + this.target.lev_id);
        console.log("this is score response: ", res.score);
        // this.target.setScore(res.score); 

        localStorage.setItem('score', res.score);
        this.target.setScore(parseInt(res.score));  //assign score to a variable
        console.log("this is score stored:", localStorage.getItem('score'));
        this.alertScore = this.alertCtrl.create({
          title: 'Score',
          subTitle: 'Score: ' + res.score + '%'
        })

        this.alertScore.present();
        this.alertScore.onDidDismiss(() => {
          console.log("Current Level for this score: ", this.target.lev_id);
          console.log("Levels Remaining after showing score: ", this.target.numLev);

          if (this.target.numLev == 0) {
            console.log("published game over");
            this.circle.setMap(null);
            this.target.event.publish('GameOver');


            // this.end();
            // this.createEndAlert();
          }
          else{
              let data = true;
              this.event.publish('loadNext',data);
          }

        });
        if (res.score == 100) {
          this.numcircles = 1;
        }
        else if (res.score > 50) {
          this.numcircles = 2;
          console.log("numcircle = ", this.numcircles);
          this.api.getOneRandomCoords().subscribe(
            res => {
              this.createDummyCircle(res.lat, res.lng);
            }
          );
        }
        else {
          this.numcircles = 3;
          console.log("numcircle = ", this.numcircles);
          this.api.getTwoRandomCoords().subscribe(
            res => {
              this.createDummyCircle(res[0].lat, res[0].lng);
              this.createAnotherDummyCircles(res[1].lat, res[1].lng);
            }
          );
        }
        let temp: any = parseInt(localStorage.getItem('userScore')) + parseInt(res.score)
        localStorage.setItem('userScore', temp);
      }
    );
    this.target.answers.length = 0;

  }

  tryGeolocation() {
    // this.loading.present();
    this.checking = true;
    this.startTracking();
    let toast = this.toastCtrl.create({
      message: "Tracking started",
      duration: 3000
    })
    toast.present();
  }

  stopGeo() {
    this.checking = false;
    this.stopTracking();
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
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

  clearMarkers() {
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

  createCircle(lat: any, lng: any) {

    var pos = new google.maps.LatLng(lat, lng)

    // Add circle overlay and bind to marker
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.target.safeArea,    // in metres
      fillColor: '#0085a9',
      fillOpacity: 0,
      strokeColor: '#0085a9',
      strokeWeight: 2,
      strokeOpacity: 1,
      center: pos
    });
    this.animateCircle(this.circle);
    // this.circle.bindTo('center', marker, 'position');
  }

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
      strokeOpacity: 1,
      center: pos
    });
    this.animateCircle(this.circle1);
    // this.circle.bindTo('center', marker, 'position');
  }

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
      strokeOpacity: 1,
      center: pos
    });
    this.animateCircle(this.circle2);

    // this.circle.bindTo('center', marker, 'position');
  }

  //animate the circle
  animateCircle(circleP: any) {
    var num = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    var num2 = Math.floor(Math.random() * (3000 - 1000 + 1000)) + 1000;
    var timer = 50;
    var seen = true;

    var direction = 0.25;
    var rMin = 0, rMax = this.target.safeArea;
    setInterval(() => {
      var radius = circleP.getRadius();

      if (!seen) {

        setTimeout(() => {
          if (radius == rMin) {
            seen = true;
            circleP.setVisible(true);
          }


        }, num2);
      }

      if ((radius > rMax) || (radius < rMin)) {
        direction *= -1;
      }
      if ((radius == rMin)) {
        circleP.setVisible(false);
        seen = false;
      }
      circleP.setRadius(radius + direction * num / 2);
    },
      timer
    );
  }

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

  end(){
    this.api.endGame(this.target.username, this.target.cat_id, this.target.lev_id, this.target.score).subscribe();
    swal({ 
      title: "Congratulations",
       text: "You Win",   
       html: ' <img src="assets/img/game_over.png" height="100px"> </img>'
      }).then(()=>
    {
      this.navCtrl.pop();
      this.target.cat_id = 0;
    })
  }

  createModalQs() {
    this.modalQs = this.modalCtrl.create(ModalPage);
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
    if (this.loading){
          this.loading.dismiss();
          this.loading = null;
    }

  }

}
