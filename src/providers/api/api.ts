import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ApiProvider {

public baseUrl : string = "http://27.123.150.94/" ;
// public baseUrl : string = "http://127.0.0.1/";

  constructor(public http: Http) {
    // console.log('Hello ApiProvider Provider');
  }
// check(){
//   return this.http.get(this.baseUrl )
//   .map((res:Response)=> { 
//     if(res.status = 200){
//       return console.log("connected to external");
//    }
//    else{
//     this.baseUrl = this.baseUrl2;
//      return console.log ("connected to localhost");
     
//    }
   
//   })
// }

  getCategories(){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'cat' )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
     }
     else{
       console.log('server timeout');
     }
    })
  }

  getLevelCoords(cat_id:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'cat=' + cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
     }
     else{
       console.log('server timeout');
     }
    })
  }
  
  checkNumLevel(cat_id:any){
      return  this.http.get(this.baseUrl + 'numLev/'  + cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }
 

  checkApi(){
    var header = { "headers": {"Content-Type": "application/json"} };
    console.log('function running');
    return  this.http.post('http://mlearn.usp.ac.fj/uspmobile/app_authenticate/?username=s11109314&password=$k171639sk' , header)
   
    .map((res:Response)=> { 
      if(res.status = 200){
         return console.log((res.json())) ;
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadNextLevel(lev_id:any,cat_id:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + '/nextLevel/current='+ lev_id +'&cat=' + cat_id )
    .map((res:Response)=> { 
      return res.json();
    })
  }

  loadQuestions(lev_id:any,cat_id:any){
    return  this.http.get(this.baseUrl + 'loadQuestions/'+ lev_id + '&' + cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadScore(answerString: any){
    return  this.http.get(this.baseUrl + 'checkAns/'+ answerString )
    .map((res:Response)=> { 
      if(res.status = 200){
          //  console.log(res);
  
     
        // console.log("res from api: ", res);
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  getOneRandomCoords(){
    console.log("inside function");
    return  this.http.get(this.baseUrl + 'getRan/1' )
    .map((res:Response)=> { 
      if(res.status = 200){
          
  
     
        // console.log("res from api: ", res);
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }
  
  getTwoRandomCoords(){
    return  this.http.get(this.baseUrl + 'getRan/2' )
    .map((res:Response)=> { 
      if(res.status = 200){
           console.log(res);
  
     
        // console.log("res from api: ", res);
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

}
