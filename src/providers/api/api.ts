import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ApiProvider {

// public baseUrl : string = "http://27.123.150.94/" ;
// public baseUrl : string = "http://127.0.0.1/";
public baseUrl : string = "https://fsteeduapp.000webhostapp.com/";
// public baseUrl : string = "http://192.168.8.180/";

  constructor(public http: Http) {

  }


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

  // checkUSPApi(username:any,password:any) {
  //   // return this.http.get("http://mlearn.usp.ac.fj/uspmobile/IEP_authenticate/?username="+username+"&password="+password )
  //   // .map((res:Response)=>{

  //   //   return res.json();
  //   // });
  //   return  this.http.get(this.baseUrl + 'login/'+ username + '&' + password )
  //   .map((res:Response)=> { 
  //     if(res.status = 200){
  //        return res.json();
  //     }
  //     else{
  //       console.log('server timeout');
  //     }

  //   })


  // }

  checkUSPApi(username:any,password:any){
    let postData = new FormData();
    postData.append('sid' , username);
    postData.append('pass' , password);


    // let postData = {
    //         'sid' : username,
    //         'password': password
    // }
    return this.http.post(this.baseUrl +'loginUser', postData)
    .map((res:Response)=> { 
      if(res.status = 200){
         return res.json();
      }
      else{
        console.log('server timeout');
      } 
    })

  }


  loadNextLevel(lev_id:any,cat_id:any){
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

  loadScore(catId:any,lnum:any,answerString: any){
    return  this.http.get(this.baseUrl + 'checkAns/'+ catId + '&' + (lnum -1) + '&' + answerString )
    .map((res:Response)=> { 
      if(res.status = 200){
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
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

}
