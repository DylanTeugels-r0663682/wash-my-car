import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  @Output() fire: EventEmitter<any> = new EventEmitter();

   constructor() {
     console.log('shared service started');
   }

   change(distance) {
     this.fire.emit(distance);
   }

   getEmittedValue() {
     return this.fire;
   }
}
