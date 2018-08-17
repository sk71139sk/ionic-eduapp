import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ApiProvider {
public baseUrl : string = "http://127.0.0.1/";

  constructor(public http: Http) {
    // console.log('Hello ApiProvider Provider');
  }
  getCategories(){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'cat' )
    .map((res:Response)=> { 
      return res.json();
    })
  }

  getLevelCoords(cat_id:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'cat=' + cat_id )
    .map((res:Response)=> { 
      return res.json();
    })
  }
  
  checkIfLastlevel(lev_id:any,cat_id:any){
    
     return this.http.get(this.baseUrl + 'checkIfLastLevel=' + lev_id + "&" + cat_id )
    .map((res:Response)=> { 
      return (res.json());
    })
  }

}
