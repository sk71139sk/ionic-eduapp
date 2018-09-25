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

  getSavedCategories(username:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'SavedCat/' + username )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
    }
    else{
      console.log('server timeout');
    }
    })
  }

  getCompCategories(username:any){
    // console.log('running function');

    return this.http.get(this.baseUrl + 'CompCat/' + username )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
    }
    else{
      console.log('server timeout');
    }
    })
  }


  createSession(userId:any,catId:any){
    return this.http.get(this.baseUrl + '/createGame/'+ userId + '&'+ catId )
    .map((res:Response)=> { 
      if(res.status = 200){
        return ;
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

  checkUSPApi(username:any,password:any){
    let postData = new FormData();
    postData.append('sid' , username);
    postData.append('pass' , password);

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

  loadLevel(cat_id:any,levNum:any,userId:any,score:any){
    return this.http.get(this.baseUrl + '/loadLevel/' + cat_id +'&'+ levNum +'&'+ userId +'&'+ score)
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
    return  this.http.get(this.baseUrl + 'checkAns/'+ catId + '&' + lnum  + '&' + answerString )
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

  endGame(userId:any,catId:any,levNum:any,score:any){
    return this.http.get(this.baseUrl + '/endGame/'+ userId + '&'+ catId+ '&'+ levNum + '&'+ score )
    .map((res:Response)=> { 
      if(res.status = 200){
        console.log('game end session updated');
        return ;
     }
     else{
       console.log('server timeout');
     }
    })
  }

  loadGame(userId:any,catId:any){
    return this.http.get(this.baseUrl + '/loadGame/'+ userId + '&'+ catId )
    .map((res:Response)=> { 
      if(res.status = 200){
        return res.json();
     }
     else{
       console.log('server timeout');
     }
    })
  }

  saveGame(username:any,catId:any,lNum:any,score:any){
    return this.http.get(this.baseUrl + '/saveGame/'+ username + '&'+ catId+ '&'+ lNum + '&'+ score )
    .map((res:Response)=> { 
      if(res.status = 200){
        return res;
     }
     else{
       console.log('server timeout');
     }
    })
  }

}
