import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {TargetProvider} from '../target/target';


@Injectable()
export class ApiProvider {

/*  These are API calls, for detailed explanations of these api calls, refer
    to the Laravel side as this side only makes calls and retrieves data 
*/

  constructor(public http: Http, public target:TargetProvider) {

  }
  getUserData(){
    return this.http.get(this.target.baseUrl + '/init/' + this.target.username)
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
     }
     else{
       console.log('server timeout');
     }
    })
  }

  updateDetails(){
    let postData = new FormData();
    postData.append('student_id' , this.target.username);
    postData.append('fName' , this.target.firstName);
    postData.append('lName' , this.target.lastName);
    postData.append('photo' , this.target.pBase64);

    return this.http.post(this.target.baseUrl +'updateDetails', postData)
    .map((res:Response)=> { 
      if(res.status = 200){
         return res.json();
      }
      else{
       return res.json();
      } 
    })
  }

  getCategories(){
    return this.http.get(this.target.baseUrl + 'cat' )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
     }
     else{
       console.log('server timeout');
     }
    })
  }

  getCategories2(username:any){
    return this.http.get(this.target.baseUrl + 'catGet/' + username )
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
    return this.http.get(this.target.baseUrl + 'SavedCat/' + username )
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
    return this.http.get(this.target.baseUrl + 'CompCat/' + username )
    .map((res:Response)=> { 
      if(res.status = 200){
        return (res.json());
    }
    else{
      console.log('server timeout');
    }
    })
  }

  removeSaved(catId:any){
    return this.http.get(this.target.baseUrl + 'removeSavedGame/'+ this.target.username +'&' + catId )
    .map((res:Response)=> { 
      if(res.status = 200){
        return ;
     }
     else{
       console.log('server timeout');
     }
    })
  }

  getLineChartData(){
    return this.http.get(this.target.baseUrl + 'getLineChart/' + this.target.username )
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
    return this.http.get(this.target.baseUrl + '/createGame/'+ userId + '&'+ catId )
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
    return this.http.get(this.target.baseUrl + 'cat=' + cat_id )
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
      return  this.http.get(this.target.baseUrl + 'numLev/'  + cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  checkToken(username:any){
    let postData = new FormData();
    postData.append('student_id' , username);
    postData.append('login' , 'false');

    return this.http.post(this.target.baseUrl +'loginUser', postData)
    .map((res:Response)=> { 
         return res.json();
    })

  }

  checkUSPApi(username:any,password:any){
    let postData = new FormData();
    postData.append('student_id' , username);
    postData.append('password' , password);
    postData.append('login' , 'true');

    return this.http.post(this.target.baseUrl +'loginUser', postData)
    .map((res:Response)=> { 
         return res.json();
    })
  }


  loadNextLevel(lev_id:any,cat_id:any){
    return this.http.get(this.target.baseUrl + '/nextLevel/current='+ lev_id +'&cat=' + cat_id )
    .map((res:Response)=> { 
      return res.json();
    })
  }

  loadLevel(cat_id:any,levNum:any,userId:any,score:any){
    return this.http.get(this.target.baseUrl + '/loadLevel/' + cat_id +'&'+ levNum +'&'+ userId +'&'+ score +'&' + this.target.numcircles)
    .map((res:Response)=> { 
      return res.json();
    })
  }
  

  loadQuestions(lev_id:any,cat_id:any){
    return  this.http.get(this.target.baseUrl + 'loadQuestions/'+ lev_id + '&' + cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadScore(catId:any,lnum:any,quesString:any,answerString: any){
    return  this.http.get(this.target.baseUrl + 'checkAns/'+ this.target.username+'&'+ catId + '&' + lnum  + '&' + quesString + '/' + answerString )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadScoreBoard(){
    return  this.http.get(this.target.baseUrl + '/scoreBoard/' + this.target.cat_id )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadStandings(){
    return  this.http.get(this.target.baseUrl + '/overallScoreBoard' )
    .map((res:Response)=> { 
      if(res.status = 200){
         return (res.json());
      }
      else{
        console.log('server timeout');
      }

    })
  }

  loadresults(catId:any){
    return this.http.get(this.target.baseUrl + 'results/' + this.target.username+ '&' +catId)
    .map((res:Response)=>{
      if (res.status = 200){
        return res.json();
      }
      else{
        console.log('server timeout');
      }
    })
  }

  getOneRandomCoords(){
    console.log("inside function");
    return  this.http.get(this.target.baseUrl + 'getRan/1' )
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
    return  this.http.get(this.target.baseUrl + 'getRan/2' )
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
    return this.http.get(this.target.baseUrl + '/endGame/'+ userId + '&'+ catId+ '&'+ levNum + '&'+ score+'&' + this.target.numcircles )
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
    return this.http.get(this.target.baseUrl + '/loadGame/'+ userId + '&'+ catId )
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
    return this.http.get(this.target.baseUrl + '/saveGame/'+ username + '&'+ catId+ '&'+ lNum + '&'+ score+'&' + this.target.numcircles )
    .map((res:Response)=> { 
      if(res.status = 200){
        return res;
     }
     else{
       console.log('server timeout');
     }
    })
  }

  //checks for visited trees from database
  refresh(){
    return this.http.get(this.target.baseUrl + '/update/' + this.target.username)
    .map((res:Response)=> { 
      if(res.status = 200){
        return res.json();
     }
     else{
       console.log('server timeout');
     }
    })
  }

  visit(cocos:any){
    return this.http.get(this.target.baseUrl + '/visit/' + this.target.username+'&' + cocos)
    .map((res:Response)=> { 
      if(res.status = 200){
        return;
     }
     else{
       console.log('server timeout');
     }
    })
  }

  //sets the visited tree to false
  updateCoco(){
    return this.http.get(this.target.baseUrl + '/updateCoconuts/' + this.target.username +'&'+ this.target.coconuts )
    .map((res:Response)=> { 
      if(res.status = 200){
        return;
     }
     else{
       console.log('server timeout');
     }
    })
  }

  logOut(){
    return this.http.get(this.target.baseUrl + '/logOut/' + this.target.username  )
    .map((res:Response)=> { 
      if(res.status = 200){
        return;
     }
     else{
       console.log('server timeout');
     }
    })
  }

}
