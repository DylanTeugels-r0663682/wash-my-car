import { AuthService } from './../services/auth.service';
import { FirebaseService } from './../services/firebase.service';
import { Time } from '@angular/common';
import { Address } from './address';

export class Car {
   id: string;
   owner: string;
   carBrand: string;
   carModel: string;
   washType: string;
   price: string;
   date: Date;
   time: Time;
   comments: string;
   address: Address;
   imageURL: string;

   constructor(id: string, owner: string, carBrand: string, carModel: string, washType: string, price: string, date: Date, time: Time, comments: string, address: Address, imageURL: string)
   {
      this.id = id;
      this.owner = owner;
      this.carBrand = carBrand;
      this.carModel = carModel;
      this.washType = washType;
      this.price = price;
      this.date = date;
      this.time = time;
      this.comments = comments;
      this.address = address;
      this.imageURL = imageURL;
   }
}