import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

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
  
  checkNumLevel(cat_id:any){
      return  this.http.get(this.baseUrl + 'numLev/'  + cat_id )
    .map((res:Response)=> { 
      if(res){
        return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

//   checkNumLevel(cat_id:any): Promise<any> {
//     return this.http.get(this.baseUrl + 'numLev/'  + cat_id )
//         .map(res => res.json())     // Get the body of the response
//         .toPromise()            // Convert the observable into a promise
//         .then(
//             res => {           // Success callback
//                    return (res);

//                 // Since the http get is async, you need to place the logic
//                 // to save the data in the storage here!
//                 // ...
//                 // this.storage.set('data', JSON.stringify(response));
//                 // ...

//                 console.log("Last line"); 
//             },
//             error => {              // Error callback

//                 // TODO: Handle error
//                 // ...

//                 console.log(error);
//                 return error;
//             });
// }

  loadNextLevel(lev_id:any,cat_id:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + '/nextLevel/current='+ lev_id +'&cat=' + cat_id )
    .map((res:Response)=> { 
      return res.json();
    })
  }

}
