import { Controls } from './../../controls';
import { NavController, IonicModule } from '@ionic/angular';
import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import firebase from 'firebase'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import data from '../../json/cars.json'
import { Location, Time } from '@angular/common'
import { Plugins } from '@capacitor/core';
import { Apply } from 'src/app/models/apply';
import { Wash } from 'src/app/models/wash';

@Component({
  selector: 'app-my-cars-detail',
  templateUrl: './my-cars-detail.page.html',
  styleUrls: ['./my-cars-detail.page.scss'],
})
export class MyCarsDetailPage implements OnInit {
  navigated = false;
  car: any = " ";
  imageURL: any = " ";
  loaded = false;

  id: any;
  carBrand: any;
  carModel: any;
  washType: any;
  price: any;
  date: Date;
  time: Time;
  comments: any;

  street: any;
  city: any;
  number: any;

  washes: Wash[] = []
  
  
  brands: Array<any> = this.sortByProperty(data, "name");
  models: any;

  alternativeAddress: boolean = false;

  //form
  //Form validation
  validations_form: FormGroup;
  validation_messages = {
    'carBrand' : [
      { type: 'required', message: 'Car Brand is required.' },
    ],
    'carModel' : [
      { type: 'required', message: 'Car Model is required.' },
    ],
    'city' : [
      { type: 'required', message: 'City Model is required.' },
    ],
    'street' : [
      { type: 'required', message: 'Street Model is required.' },
    ],
    'number' : [
      { type: 'required', message: 'House number is required.' },
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
  }

  constructor(
    private route: ActivatedRoute, 
    private firebaseService: FirebaseService, 
    private navCtrl: NavController, 
    private formBuilder: FormBuilder, 
    private location: Location,
    public helper: Controls
  ) { 

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loaded = false;
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = this.route.snapshot.paramMap.get('id');
        this.navigated = true;
        this.firebaseService.getCar(id).then(car => this.car = car).then(car => this.loadCar(car));
        this.firebaseService.getCarPhoto(id).then(imageURL => this.imageURL = imageURL).then(() => this.loaded = true).then(() => this.helper.loadingCtrl.dismiss());
      } else {
        this.navigated = false;
      }
    });
    this.formValidator();
    this.firebaseService.getWashes().subscribe((washes) => this.getWashes(washes));
  }


  loadCar(car){
    this.id = car.id
    this.carBrand = car.carBrand
    this.changeBrand(this.carBrand)
    this.carModel = car.carModel
    this.city = car.city
    this.street = car.street
    this.number = car.number
    this.washType = car.washType
    this.price = car.price
    this.date = car.date
    this.time = car.time
    this.comments = car.comments

  }

  getWashes(washes){
    this.washes = [];
    for(let wash of washes){
      this.washes.push(new Wash(wash.id, wash.washerId, wash.washer, wash.car))
    }
  }

  async updateCar(){
    console.log(this.carBrand);
    console.log(this.id);
    console.log(firebase.auth().currentUser.uid)
    this.helper.showLoading("Updating...")
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/cars/' + this.id).update({
      'carBrand': this.carBrand,
      'carModel': this.carModel,
      'washType': this.washType,
      'city': this.city,
      'street': this.street,
      'number': this.number,
      'price': this.price,
      'date': this.date,
      'time': this.time,
      'comments': this.comments == '' || !this.comments ? 'no comments' : this.comments
    })
    .then(() => this.helper.loadingCtrl.dismiss())
    .then(() => this.location.back())
  }

  changeBrand(name){
    this.models = this.brands.find(brand => brand.name == name.trim()).models
    this.carModel = "";
  }

  setWashType(washType){
    this.washType = washType
  }

  setAlternativeAddress(value: boolean){
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

  deleteCar(id){
    if(this.hasWashes(id)){
      this.helper.showToast("Can't delete cars which still have upcoming washes")
      return;
    }
    this.helper.showLoading("Deleting...")
    this.firebaseService.deleteCar(id).then(() => this.helper.loadingCtrl.dismiss()).then(() => this.navCtrl.back());
  }

  hasWashes(id: string){
    if(this.washes){
      for(let wash of this.washes){
        console.log(wash)
        if(wash.car.id == id) return true;
      }
    }
    return false;
  }

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

}
