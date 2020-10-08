import { NavController } from '@ionic/angular';
import { Controls } from './../../controls';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { Wash } from 'src/app/models/wash';
import { Apply } from 'src/app/models/apply';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  count: any;
  washes: Wash[] = [];
  applies: Apply[] = [];
  segment = true;


  constructor(
    private firebaseService: FirebaseService,
    private helper: Controls,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.firebaseService.getRequests().subscribe(list => this.observableLength(list));
    this.firebaseService.getWashes().subscribe((washes) => this.getWashes(washes));
    this.firebaseService.getApplies().subscribe((applies) => this.getApplies(applies));
  }

  getWashes(washes){
    this.washes = [];
    for(let wash of washes){
      this.washes.push(new Wash(wash.id, wash.washerId, wash.washer, wash.car))
    }
  }

  getApplies(applies){
    this.applies = [];
    for(let apply of applies){
      this.applies.push(new Apply(apply.id, apply.washerId, apply.washer, apply.car))
    }
  }

  observableLength(list){
    let count = 0;
    for(let item in list){
      count++;
    }
    this.count = count;
  }

  segmentChanged(event){
    if(event.target.value == "applies") this.segment = false;
    else this.segment = true;
  }

  tryGoReviewPage(washerId: string, washId: string, carId: string){
    this.helper.showAlert("Warning!", "Only click this button after your car is washed!", ['Cancel', {text: "Finish", handler: (x) => {this.goReviewPage(washerId, washId, carId)}}])
  }

  goReviewPage(washerId: string, washId: string, carId: string){
    console.log(carId)
    this.navCtrl.navigateRoot("/tabs/review/" + washerId + "/" + washId + "/" + carId);
  }

}
