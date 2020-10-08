import { Car } from './car';

export class Wash {
   id: string;
   washerId: string;
   washer: string;
   car: Car;

   constructor(id: string, washerId: string, washer: string, car: Car){
      this.id = id;
      this.washerId = washerId;
      this.washer = washer;
      this.car = car;
   }

}