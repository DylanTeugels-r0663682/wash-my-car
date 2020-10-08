import { Controls } from './../../controls';
import { FeedFilterComponent } from './feed-filter/feed-filter.component';
import { FirebaseService } from './../../services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import firebase from 'firebase';
import { NavController, PopoverController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service'
import { Router } from '@angular/router';
//require('firebase/auth');

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  loggedInUser: any;
  cars: any;
  currentPopover = null;
  distance = 20;
  subscription;

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private firebaseService: FirebaseService, 
    private afdb: AngularFireDatabase,
    private popoverCtrl: PopoverController,
    private sharedService: SharedService,
    private router: Router,
    private helper: Controls,
  ) 
  {
    this.subscription = this.sharedService.getEmittedValue()
    .subscribe(item => {
      this.setDistance(item),
      this.distance = item,
      this.popoverCtrl.dismiss()
    })
  }

  
  ionViewDidEnter(){
  }
  
  ngOnInit() {
    this.setDistance()
  }

  onLoad(car) {
    let card = document.getElementById(car.id)
    card.style.height = 'fit-content'
    document.getElementById(car.id + "spinner").remove();
  }

  async sortByProperty(objArray, prop){
    if (arguments.length<2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
    if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    const clone = objArray.slice(0);
    const direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
    const propPath = (prop.constructor===Array) ? prop : prop.split(".");
    clone.sort(function(a,b){
        for (let p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
        }
        // convert numeric strings to integers
        a = a.match(/^\d+$/) ? +a : a;
        b = b.match(/^\d+$/) ? +b : b;
        return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
    });
    return clone;
  }

  async refreshFeed(event){
    console.log('begin async op')
    this.cars = this.firebaseService.getAllCars(this.distance).then(cars => {
      this.cars = cars,
      event.target.complete();
    });
  }

  async handleButtonClick(ev) {
    let popover = await this.popoverCtrl.create({
      component: FeedFilterComponent,
      event: ev,
      translucent: true
    });
    return popover.present();
  }

  setDistance(distance?){
    this.firebaseService.getAllCars(distance)
    .then(cars => this.cars = cars).then(() => console.log("cars fetched"))
    if(distance) window.localStorage.setItem('distance', distance)
    else window.localStorage.setItem('distance', "20")
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  goMyCarsDetailPage(car){
    this.router.navigateByUrl('/tabs/feed/detail/' + car.id + '/' + car.owner);
  }

}
