import { Component, NgZone } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';


@Component({
  selector: 'places-map',
  templateUrl: 'places.html'
})
export class PlacesPage {
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  nearbyItems: any = new Array<any>();
  loading: any;


  constructor(
    public zone: NgZone,
    public target : TargetProvider, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl : NavController,
    public api : ApiProvider
  ) {

    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    this.loading = this.loadingCtrl.create();
  }

  changeValue(value1:any,value2:any,value3:any,value4:any){
    // this.api.getTwoRandomCoords().subscribe(
    //   res=>{
    //     console.log("api response here: lat1:", res[0].lat,' lng1:',res[0].lng,"lat2:", res[1].lat,' lng2:',res[1].lng);
    //   }
    // );
    this.target.safeArea = value1;
    this.target.testLat = value2;
    this.target.testLng = value3;
    this.api.baseUrl = value4;
    this.target.alertGiven = false;
    let alert = this.alertCtrl.create({
      title: 'Done',
      subTitle: 'Changes applied, navigate back to the map to view changes!',
      buttons: ['Close']
    });
    alert.present();
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
    this.loading.present();
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.autocompleteItems = [];
        this.GooglePlaces.nearbySearch({
          location: results[0].geometry.location,
          radius: '500',
          types: ['restaurant'], //check other types here https://developers.google.com/places/web-service/supported_types
          // key: 'YOUR_KEY_HERE'
        }, (near_places) => {
          this.zone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
            this.loading.dismiss();
          });
        })
      }
    })
  }
}
