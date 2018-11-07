import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider} from '../../providers/api/api';
import { TargetProvider} from '../../providers/target/target';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { Chart } from 'chart.js';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('lineCanvas') lineCanvas;


  lineChart: any;
  standings: any;

  visibility1: boolean = false;
  visibility2: boolean = true;
  buttonDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public target: TargetProvider, public api: ApiProvider, public camera:Camera) {

  }

  ionViewDidLoad() {
    this.loadLinechart();
    this.loadStandings();
    this.api.getUserData();

  }

  editProfile(){
    this.buttonDisabled = true;
    this.visibility1 = true;
    this.visibility2 = false;
  }

  logOut(){
    localStorage.clear();
    this.api.logOut().subscribe();
    this.navCtrl.setRoot(LoginPage);
  }

openCamera(){
  const options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.NATIVE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  
  this.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64 (DATA_URL):
   this.target.photo =  imageData;
  }, (err) => {
   alert("error");
  });
}

openGallery(){
  const options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    saveToPhotoAlbum: false
  }
  
  this.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64 (DATA_URL):
   this.target.pBase64 = imageData;
   this.target.setPhoto(imageData);
  }, (err) => {
   alert("error");
  });
}

  update(){
    this.api.updateDetails().subscribe(
      (res)=>{});
  this.buttonDisabled = false;
  this.visibility2 = true;
  this.visibility1 = false;
}

  closeUpdate(){
    this.buttonDisabled = false;
    this.visibility2 = true;
    this.visibility1 = false;
  }

  loadStandings(){
    this.api.loadStandings().subscribe(
      (res)=>{
        console.log(res);
        this.standings = res;
      }
    );
  }



  loadLinechart(){
    //get data for line chart
    this.api.getLineChartData().subscribe(
      (res)=>{
          console.log(res);

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'bar',
          data: {
            //labels are cat_name
              labels: res[0],
              datasets: [
                  {
                      label: "Score",
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,1)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      //data is cat_score from session
                      data: res[1],
                      spanGaps: false,
                  }
              ]
          },
          options: {
            scales: {
              xAxes : [
                {
                  ticks: {
                    autoSkip: false
                  }
                }
              ],
              yAxes : [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
    
      });
      }
    );

    
  }

}
