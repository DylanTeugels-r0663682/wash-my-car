import { FirebaseService } from './../../services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { User } from 'src/app/models/user';
import { Address } from 'src/app/models/address';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  private uid;

  lat 
  lon
  precision

  reviews: any = []
  user: User;
  loaded = false;

  rating;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService
  ){
    this.authService.getUser(firebase.auth().currentUser.uid).then(user => this.loadUser(user));
    this.firebaseService.getUserReviews(firebase.auth().currentUser.uid).subscribe(reviews => this.loadReviews(reviews))
  }

  loadUser(user){
    console.log(user.reviews)
    this.user = new User(user.id, user.username, user.email, user.tel, new Address(user.city, user.street, user.number), user.reviews);
    this.loaded = true;
  }

  loadReviews(reviews){
    this.reviews = reviews
    this.calculateRating();
  }

  calculateRating(){
    let sum = 0;
    for(let review of this.reviews){
      sum += review.rating
    }
    this.rating = sum / this.reviews.length
  }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }

  getCurrentLocation(){
    this.firebaseService.getCurrentLocation().then( location => {
      this.lat = location.coords.latitude,
      this.lon = location.coords.longitude
      this.precision = location.coords.accuracy
    })
  }

}
