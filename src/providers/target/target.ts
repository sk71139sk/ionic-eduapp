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
  safeArea: any = 5;
  testLat: any = -18.147871;
  testLng: any = 178.443096;
  alertGiven: boolean = false;
  cat_id :any;
  lev_id :any;
}
