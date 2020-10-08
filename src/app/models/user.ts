import { Address } from './address';
import { Review } from './review';

export class User {
   id: string
   username: string;
   email: string;
   tel: string;
   address: Address;
   reviews: Review[];

   constructor(id: string, username: string, email: string, tel: string, address: Address, reviews?: Review[]){
      this.id = id;
      this.username = username;
      this.email = email;
      this.tel = tel;
      this.address = address;
      if(reviews) this.reviews = reviews;
   }
}