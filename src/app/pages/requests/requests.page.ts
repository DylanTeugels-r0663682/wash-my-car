import { Controls } from './../../controls';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Car } from 'src/app/models/car';
import { User } from 'src/app/models/user';
import { Request } from 'src/app/models/request' 
import { Address } from 'src/app/models/address';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  requests: Request[] = [];

  constructor(
    private firebaseService: FirebaseService,
    public authService: AuthService,
    public helper: Controls,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.firebaseService.getRequests()
    .subscribe(
      (requests) => this.loadRequests(requests)
    );
  }

  loadRequests(requests){
    this.requests = [];
    for(let request of requests){
      this.requests.push(new Request(request.id, request.washerId, request.washer, request.car))
    }
  }

  selectRequest(request){
    this.helper.showAlert("Request", "Do you want to accept this request?", ['Cancel', {text: "Reject", handler: (x) => {this.Reject(request)}}, {text: "Approve", handler: (x) => {this.Approve(request)}}])
  }

  Approve(request){
    console.log("approved");
    this.firebaseService.approveRequest(request);
  }

  Reject(request){
    this.firebaseService.rejectRequest(request.id)
  }

  goUserProfilePage(uid: string){
    this.router.navigateByUrl('/tabs/user-profile/' + uid);
  }

}
