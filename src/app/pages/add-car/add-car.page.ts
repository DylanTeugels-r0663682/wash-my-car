import { Car } from 'src/app/models/car';
import { LoadingController, AlertController } from '@ionic/angular';
import { FirebaseService } from './../../services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import data from '../../json/cars.json';
import { Router } from '@angular/router';
import { Time } from '@angular/common';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

  
  //Values from add-car form get stored here
  carBrand: string = "Choose Brand...";
  carModel: any = "Choose Model...";
  washType: any = "inside";
  price: any;
  date: Date;
  time: Time;
  comments: any;
  
  street: any;
  city: any;
  number: any;

  image: any;
  imageURL: any;

  

  brands: Array<any> = this.sortByProperty(data, "name");
  models: any;
  
  alternativeAddress: any;
  
  //Form validation
  validations_form: FormGroup;
  validation_messages = {
    'carBrand' : [
      { type: 'required', message: 'Car Brand is required.' },
    ],
    'carModel' : [
      { type: 'required', message: 'Car Brand is required.' },
    ],
    'city' : [
      { type: 'required', message: 'City is required.' },
    ],
    'street' : [
      { type: 'required', message: 'Street is required.' },
    ],
    'number' : [
      { type: 'required', message: 'Number is required.' },
    ],
    'price' : [
      { type: 'required', message: 'Price is required.' },
    ],
    'date' : [
      { type: 'required', message: 'Date is required.' },
    ],
    'time' : [
      { type: 'required', message: 'Time is required.' },
    ],
    'comments' : [
      { type: 'required', message: 'Comments is required.' },
    ],
  }

  ngOnInit() {
    this.formValidator();
    this.alternativeAddress = false;
  }

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

   formValidator(){
    this.validations_form = this.formBuilder.group({
      carBrand: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      carModel: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      city: new FormControl(
        "",
        Validators.compose([
          this.alternativeAddress ? Validators.required : null,
        ])
      ),
      street: new FormControl(
        "",
        Validators.compose([
          this.alternativeAddress ? Validators.required : null,
        ])
      ),
      number: new FormControl(
        "",
        Validators.compose([
          this.alternativeAddress ? Validators.required : null,
        ])
      ),
      price: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      date: new FormControl(
        "",
        Validators.compose([
          Validators.required, 
        ])
      ),
      time: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      comments: new FormControl(
        "",
        Validators.compose([
        ])
      ),
  });
}

  
  changeBrand(name){
    this.models = this.brands.find(brand => brand.name == name.trim()).models
    this.carModel = "";
  }

  async addCar(){
    const loading = await this.loadingCtrl.create();

    let city = this.authService.getLoggedInUser().city;
    let street = this.authService.getLoggedInUser().street;
    let number = this.authService.getLoggedInUser().number;

    if(this.alternativeAddress){
      city = this.city;
      street = this.street;
      number = this.number;
    }

    if(this.comments == null || this.comments.trim() == ''){
      this.comments = "no comments"
    }

    let car = {
      'carBrand': this.carBrand, 
      'carModel': this.carModel, 
      'washType': this.washType, 
      'city': city, 
      'street': street, 
      'number': number, 
      'price': this.price,
      'date': this.date,
      'time' : this.time,
      'comments': this.comments,
      'image': this.image
    }

    this.firebaseService.addCar(car).then(
      () => {
        loading.dismiss().then(() => {
          this.router.navigateByUrl('/tabs/my-cars');
        });
      },
      error => {
        console.error(error);
      }
    )

    return await loading.present();

  }

  sortByProperty(objArray, prop){
    if (arguments.length<2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
    if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    const clone = objArray.slice(0);
    const direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
    const propPath = (prop.constructor===Array) ? prop : prop.split(".");
    clone.sort(function(a,b){
        for (let p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
        }
        // convert numeric strings to integers
        a = a.match(/^\d+$/) ? +a : a;
        b = b.match(/^\d+$/) ? +b : b;
        return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
    });
    return clone;
  }

  setAlternativeAddress(value){
    this.alternativeAddress = value;
    if(!value){
      this.validations_form.removeControl('city');
      this.validations_form.removeControl('street');
      this.validations_form.removeControl('number');
    }
    else{
      this.validations_form.addControl('city', new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ));
      this.validations_form.addControl('street', new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ));
      this.validations_form.addControl('number', new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ));

    }
  }

  setWashType(value){
    this.washType = value;
  }

  onFileChanged(event){
    if (event.length === 0)
      return;
 
    let mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      this.imageURL = null;
      return;
    }
 
    let reader = new FileReader();
    //this.imagePath = event;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result;
      this.image = event.target.files[0];
    }
  }


}
