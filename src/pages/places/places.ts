import { Component, NgZone } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { TargetProvider } from '../../providers/target/target';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

import { MenuPage } from '../menu/menu';


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

  Submit(username:any,password:any){
      this.api.checkUSPApi(username,password).subscribe(data=>{
        if (data.auth== 1){
          // return false;
          alert("Invalid Credentials")
        }
        else if (data.auth == 0){
          // return true;
          this.navCtrl.push(MenuPage);
        }
      },error=>{
        alert("Error Received "+error);
      }
    );
    
  }
  skip(){
    this.navCtrl.push(MenuPage);
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
