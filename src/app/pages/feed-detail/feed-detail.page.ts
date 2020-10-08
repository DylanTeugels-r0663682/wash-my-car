import { Controls } from './../../controls';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Time } from '@angular/common';
import { AppPluginWeb } from '@capacitor/core';
import { Car } from 'src/app/models/car';
import { Address } from 'src/app/models/address';
import { User } from 'src/app/models/user';
import firebase, { database } from 'firebase'

@Component({
  selector: 'app-feed-detail',
  templateUrl: './feed-detail.page.html',
  styleUrls: ['./feed-detail.page.scss'],
})
export class FeedDetailPage implements OnInit {

  loaded = false;
  navigated = false;
  imageURL: any = " ";

  public car: Car;
  public washer;
  public owner;


  constructor(
    private route: ActivatedRoute, 
    private firebaseService: FirebaseService, 
    private authService: AuthService,
    public helper: Controls
    
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loaded = false;
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined && params['owner'] !== undefined) {
        let id = this.route.snapshot.paramMap.get('id');
        let owner = this.route.snapshot.paramMap.get('owner')
        this.navigated = true;
        this.firebaseService.getCar(id, owner).then(car => this.loadCar(car)).then(() => this.washer = this.authService.getUserWithID(firebase.auth().currentUser.uid)).then(() => this.owner = this.authService.getUserWithID(this.car.owner));
        this.firebaseService.getCarPhoto(id, owner).then(imageURL => this.imageURL = imageURL).then(() => this.loaded = true).then(() => this.helper.loadingCtrl.dismiss());
      } else {
        this.navigated = false;
      }
    });
  }

  loadCar(car){
    this.car = new Car(car.id, car.owner, car.carBrand, car.carModel, car.washType, car.price, car.date, car.time, car.comments, new Address(car.city, car.street, car.number), car.imageURL);
  }

  applyConfirm(){
    this.helper.showAlert("You are about to apply", "Are you sure you want to apply?", ['Cancel', {text: "Apply", handler: (x) => {this.apply()}}]);
  }

  apply(){
    this.firebaseService.apply(this.car, this.washer);
  }

}
