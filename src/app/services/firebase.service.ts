import { Controls } from './../controls';
import { MyCarsDetailPageRoutingModule } from './../pages/my-cars-detail/my-cars-detail-routing.module';
import { Geolocation} from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuthService } from './auth.service';
import { resolve } from 'url';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Injectable, ɵChangeDetectorStatus } from '@angular/core';
import firebase, { database } from 'firebase'
import { AngularFirestore, Reference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage'
import { Car } from '../models/car';
import { Review } from '../models/review';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userCars: any = [];
  allCars: any = [];
  observableUserCars: Subject<any> = new Subject()

  constructor(
    public firestore: AngularFirestore, 
    public afdb: AngularFireDatabase,
    private geoLocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private helper: Controls,
    private navCtrl: NavController,
    private authService: AuthService,
  ){}


  async addCar(car){
    const id = this.afdb.createPushId()
    let imageURL = ""

    await firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/photos/' + id).put(car.image)
    await firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/photos/' + id).getDownloadURL().then(url => imageURL = url)

    

    await firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/cars/' + id).set({
      id: id,
      owner: firebase.auth().currentUser.uid,
      carBrand: car.carBrand.trim(),
		  carModel: car.carModel.trim(),
      washType: car.washType,
      city: car.city,
			street: car.street,
			number: car.number,
			price: car.price,
			date: car.date,
			time: car.time,
      comments: car.comments,
      
      imageURL: imageURL
    })
  }


  getCar(id, userId?){

    if(userId){
      return new Promise((resolve, reject) => {
        firebase.database().ref('users/' + userId + '/cars/' + id ).once('value', (snapshot) => {
          resolve(snapshot.val())
        })
      })
    }

    return new Promise((resolve, reject) => {
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/cars/' + id ).on('value', (snapshot) => {
        resolve(snapshot.val())
      })
    })
  }

  async getCarPhoto(id, userId?){
    this.helper.showLoading("loading...");
    if(userId){
      return firebase.storage().ref('users/' + userId + '/photos/' + id).getDownloadURL();
    }
    return firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/photos/' + id).getDownloadURL();
  }

  
  getUserCars(){
    return this.afdb.list(firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/cars')).valueChanges();
  }

  getRequests(){
    return this.afdb.list(firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/requests")).valueChanges();
  }

  getWashes(){
    return this.afdb.list(firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/washes")).valueChanges();
  }

  getApplies(){
    return this.afdb.list(firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/applies")).valueChanges();
  }

  addReview(to: string, review: Review){
    const pushId = this.afdb.createPushId();
    firebase.database().ref("users/" + to + "/reviews/" + pushId).set({
      "from": review.from,
      "rating": review.rating,
      "comment": review.comment,
    })
  }

  getUserReviews(from: string){
    return this.afdb.list(firebase.database().ref("users/" + from + "/reviews")).valueChanges()
  }

  getAllCars(distance?: number){

    if(distance){
      console.log("distance");
    }
    else{
      console.log("no distance")
    }
    
    let currentLat, currentLon;
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    }

    return new Promise((resolve, reject) => {
      firebase.database().ref('users').once('value', (users) => {
        let cars: Array<any> = []
        for(let userUid in users.val()){
          firebase.database().ref('users/' + userUid + "/cars/").once('value' , (carsSnapshot) => {
            let carData: Array<any> = carsSnapshot.val();
            if(distance){
              for(let car in carData){
                console.log(carData[car])
                let carLat, carLon;
                this.nativeGeocoder.forwardGeocode(carData[car].city, options).then((result: NativeGeocoderResult[]) => {
                  carLat = result[0].latitude,
                  carLon = result[0].longitude
                }).then(() => {
                  let tmpDistance = this.getDistanceFromLatLonInKm(this.authService.currentLat, this.authService.currentLon, carLat, carLon)
                  if(tmpDistance <= distance && carData[car].owner != firebase.auth().currentUser.uid){
                    cars.push(carData[car])
                  }
                })
              }
            }
            else{
              for(let car in carData){
                if(carData[car].owner != firebase.auth().currentUser.uid){
                  cars.push(carData[car])
                }
              }
            }

          })
        }
        resolve(cars);
      })
    })
  }

  getCurrentLocation(){
    return this.geoLocation.getCurrentPosition();
  }

  submitReview(washerId: string, washId: string, carId: string, review: Review){
    this.helper.showLoading("Submitting review...");
    const pushId = this.afdb.createPushId();
    firebase.database().ref("users/" + washerId + "/reviews/" + pushId).set(review)
    .then(() => 
      firebase.database().ref("users/" + washerId + "/applies/" + washId).remove()
    )
    .then(() => 
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/washes/" + washId).remove()
    )
    .then(() => 
      this.deleteCar(carId)
    )
    .then(() => 
      this.helper.loadingCtrl.dismiss()
    )
    .then(() => 
      this.navCtrl.navigateRoot("/tabs/calendar")
    )
  }

  isKeyInList(list: Array<any>, keyToSearch){
    return list.hasOwnProperty(keyToSearch);
  }

  deleteCar(id){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/cars/' + id).remove();
    return firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/photos/' + id).delete();
  }

  carHasApplies(id: string) {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/applies/").once("value", function(applies) {
      if(applies.val()){
        console.log("user has applies")
        let applyData = applies.val()
        for(let apply of applyData){
          if(apply.car.id == id) return true;
        }
      }
    })
    return false;
  }

  apply(car, washer){
    this.helper.showLoading("Applying...")

    console.log(car.owner)

    if(car.owner == firebase.auth().currentUser.uid){
      this.helper.showToast("You can't apply to your own cars").then(() => this.helper.loadingCtrl.dismiss());
      return;
    }

    const pushid = this.afdb.createPushId()
    firebase.database().ref("users/" + car.owner + "/requests/" + pushid).set({
      "id": pushid,
      "washerId": firebase.auth().currentUser.uid,
      "washer": washer.username,
      "car": car

    })
    .then( () => this.navCtrl.navigateRoot("/tabs/feed"))
    .then( () => this.helper.loadingCtrl.dismiss())
    .then( () => this.helper.showToast("Apply sent successfully"))
  }

  approveRequest(request){
    console.log(request.id);
    this.helper.showLoading("Approving...");
    const pushId = this.afdb.createPushId();
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/washes/" + pushId).set({
      "id": pushId,
      "washerId": request.washerId,
      "washer": request.washer,
      "car": request.car
    }).then(() => 
      firebase.database().ref("users/" + request.washerId + "/applies/" + pushId).set({
        "id": pushId,
        "washerId": request.washerId,
        "washer": request.washer,
        "car": request.car
      })
    ).then(() => 
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/requests/" + request.id).remove()
    ).then(() => 
      this.helper.loadingCtrl.dismiss()
    ).then(() => 
      this.navCtrl.navigateRoot("/tabs/calendar")
    )

  }

  rejectRequest(requestId: string){
    this.helper.showLoading("Rejecting...");
    console.log(requestId)
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/requests/" + requestId).remove().then(() => this.helper.loadingCtrl.dismiss())
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
