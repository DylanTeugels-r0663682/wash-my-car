import { Review } from './../../models/review';
import { Controls } from './../../controls';
import { AuthService } from './../../services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { Address } from 'src/app/models/address';
import firebase from 'firebase';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  
  navigated = false;
  loaded = false;
  user: User;
  rating;
  comment = "";
  reviews: any = []

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private helper: Controls,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.route.params.forEach((params: Params) => {
      if (params['uid'] !== undefined) {
        let uid = this.route.snapshot.paramMap.get('uid');
        console.log(uid)
        this.navigated = true;
        this.authService.getUser(uid).then(user => this.loadUser(user));
        this.firebaseService.getUserReviews(uid).subscribe(reviews => this.loadReviews(reviews))
      } else {
        this.navigated = false;
      }
    });
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

  addReview(){
    this.firebaseService.addReview(this.user.id, new Review(firebase.auth().currentUser.uid, this.rating, this.comment));
  }

}
