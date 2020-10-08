import { AuthService } from './../../services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Controls } from './../../controls';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import firebase, { database } from 'firebase'
import { Review } from 'src/app/models/review';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  review: Review = new Review(this.authService.getLoggedInUser().username, null,"" );
  washerId: string;
  washId: string;
  carId: string;

  validations_form: FormGroup;
  validation_messages = {
    'rating' : [
      { type: 'required', message: 'Rating is required.' },
    ],
    'comment' : [
      { type: 'required', message: 'Comment is required.' },
    ],
  }

  constructor(
    private formBuilder: FormBuilder, 
    private helper: Controls,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) 
  {
    this.route.params.forEach((params: Params) => {
      if (params['washerId'] !== undefined && params['washId'] && params['carId']) {
        this.washerId = this.route.snapshot.paramMap.get('washerId');
        this.washId = this.route.snapshot.paramMap.get('washId');
        this.carId = this.route.snapshot.paramMap.get('carId');
      }
    });
  }

  ngOnInit() {
    this.formValidator();
  }

  submitReview(){
    this.firebaseService.submitReview(this.washerId, this.washId, this.carId, this.review);
  }

  formValidator(){
    this.validations_form = this.formBuilder.group({
      rating: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      comment: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ]),
      )
    })
  }

}
