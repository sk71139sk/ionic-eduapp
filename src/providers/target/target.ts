import { Injectable , NgZone} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Img } from '../../../node_modules/ionic-angular/umd/components/img/img-interface';

/*
  Generated class for the TargetProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TargetProvider {

  constructor(public event:Events, public zone:NgZone) {
    
  }

  //api address
  // public baseUrl : string = "http://127.0.0.1/";
  // public hostname :string = "http://127.0.0.1:6001";
  // public baseUrl : string = "http://27.123.150.94/";
  // public hostname :string = "http://27.123.150.94:6001";
    public baseUrl : string = "http://192.168.8.161/";
    public hostname :string = "http://192.168.8.161:6001";


  //first run
  firstRun : boolean = false;

  //personal details
  username : any;
  firstName: any ;
  lastName: any  ;
  photo : any = '../../assets/img/default.png';
  pBase64 : any ;



  //general app config
  safeArea: any = 8;
  testLat: any = -18.147871;
  testLng: any = 178.443096;
  alertGiven: boolean ;
  dummy1given : boolean ;
  dummy2given : boolean ;
  quesFound : boolean ;
  cat_id :any;
  cat_name : any;
  lev_id :any = 0;
  numLev: any ;
  public numcircles: number = 1;
  public answers : Array<any> = [];
  public question : Array<any> = [];
  public score : number =0;
  public points: number = 0;
  public coconuts:number = 0;
  public gameOver:boolean = false;

  //coords for dummy circles
  public coord_busBay =  new google.maps.LatLng(-18.148440, 178.446290);
  public coord_ausAid = new google.maps.LatLng(-18.147747, 178.446832);
  public coord_Default = new google.maps.LatLng(-89.345309, 115.326015);

  // coconut trees config
  public coco1 : boolean ;
  public coco2 : boolean ;
  public coco3 : boolean;
  public coco1_coord = this.coord_Default ;
  public coco2_coord =this.coord_Default ;
  public coco3_coord = this.coord_Default ;

  public cocoPoints : number = 10;
  public cocoExpense : number = 200;

  public setScore(value:number){
    this.score = this.score + value;
  }

  public setPoints(value:number){
    this.points = this.points+ value;
  }

  public setCoconuts(value:number){
    this.coconuts = this.coconuts + value;
  }

  public setCoordsCoco(lat1:any,lng1:any,lat2:any,lng2:any,lat3:any,lng3:any){

      this.coco1_coord = new google.maps.LatLng(lat1, lng1);
      this.coco1 = true;
      this.coco2_coord = new google.maps.LatLng(lat2, lng2);
      this.coco2 = true;
      this.coco3_coord = new google.maps.LatLng(lat3, lng3);
      this.coco3 = true;
      this.event.publish('coconuts');


  }

  public setCoords(lat1:any,lng1:any,lat2:any,lng2:any,lat3:any,lng3:any){
      this.coco1_coord = new google.maps.LatLng(lat1, lng1);
      this.coco2_coord = new google.maps.LatLng(lat2, lng2);
      this.coco3_coord = new google.maps.LatLng(lat3, lng3);
      this.event.publish('cocoRefresh');
  }

  //set Photo
  setPhoto(image:ImageData){
    this.photo= "data:image/jpeg;base64,"+image;
  }
}
