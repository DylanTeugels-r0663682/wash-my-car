import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseService } from './../../services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import firebase, { firestore } from 'firebase';
import { Router } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.page.html',
  styleUrls: ['./my-cars.page.scss'],
})
export class MyCarsPage implements OnInit {

  cars: any = [];
  carPhotos: any = [];

  constructor( private authService: AuthService, private firebaseService: FirebaseService, private router: Router, private afdb: AngularFireDatabase) { 
    //firebaseService.getUserCars().subscribe(cars => this.cars = cars);
    //this.loaded = true;
  }

  getUserWithCar(car){

    console.log(car)
    //return this.authService.getUserWithID(1);
  }

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.firebaseService.getUserCars().subscribe(cars => this.cars = cars)
  }

  goMyCarsDetailPage(car){
    this.router.navigateByUrl('/tabs/my-cars/detail/' + car.id);
  }

  onLoad(car) {
    let card = document.getElementById(car.id)
    card.style.height = 'fit-content'
    document.getElementById(car.id + "spinner").remove();
  }
}