import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the TargetProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TargetProvider {

  constructor() {
    
  }
  safeArea: any = 8;
  testLat: any = -18.147871;
  testLng: any = 178.443096;
  alertGiven: boolean ;
  dummy1given : boolean ;
  dummy2given : boolean ;
  quesFound : boolean ;
  cat_id :any;
  username : any;
  cat_name : any;
  lev_id :any;
  numLev: any ;
  public answers : Array<any> = [];
  public score : number =0;
  public gameOver:boolean = false;

  //coords for dummy circles
  public coord_busBay =  new google.maps.LatLng(-18.148440, 178.446290) ;
  public coord_ausAid = new google.maps.LatLng(-18.147747, 178.446832);
  public coord_Default = new google.maps.LatLng(-89.345309, 115.326015);

  public setScore(value:number){
    this.score = this.score + value;
  }


}
