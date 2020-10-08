import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { NavController, LoadingController } from "@ionic/angular";
import { AngularFireDatabase } from "@angular/fire/database";
import citiesData from '../../json/cities.json'

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {

  //Form input values
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  telephone: string;
  city: string;
  street: string;
  number: string;
  password: string;
  confirmPassword: string;

  cities = citiesData;

  //Form validations
  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  validation_messages = {
    firstName: [
      { type: "required", message: "First name is required." },
      { type: "pattern", message: "Enter a valid first name" },
    ],
    lastName: [
      { type: "required", message: "Last name is required." },
      { type: "minlength", message: "Enter a valid last name." },
      { type: "pattern", message: "Numbers are forbidden in last name" },
    ],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    birthDate: [
      { type: "required", message: "Birth Date is required." },
    ],
    telephone: [
      { type: "required", message: "Telephone number is required." },
      { type: "pattern", message: "Enter a valid telephone number." },
    ],
    city: [
      { type: "required", message: "City number is required." },
    ],
    street: [
      { type: "required", message: "Street number is required." },
    ],
    number: [
      { type: "required", message: "House number number is required." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 6 characters long.",
      },
    ],
    confirmPassword: [
      { type: "required", message: "Confirm password is required." },
    ],
  };

  constructor( private navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private loadingCtrl: LoadingController ) {}

  ngOnInit() {
    this.formValidator();
  }
  
  formValidator(){
    this.validations_form = this.formBuilder.group({
      firstName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[A-Za-z]{2,32}"),
        ])
      ),
      lastName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[A-Za-z ]{2,32}"),
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      birthDate: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      telephone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      city: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      street: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      number: new FormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required]),
      ),
      confirmPassword: new FormControl(
        "",
        Validators.required,
      ),

    },
    {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    if (control.get('password').value !== control.get('confirmPassword').value) {
      control.get('confirmPassword').setErrors({});
    }
  }

  
/*
  tryRegister() {
    const user = {'firstName': this.firstName, 'lastName': this.lastName, 'email': this.email, 'birthDate': this.birthDate, 'telephone': this.telephone, 'city' : this.city, 'street': this.street, 'number': this.number, 'password': this.password }
    this.authService.register(user)
     .then(res => {
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       this.authService.showToast(err.message)
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  //nav
  goLoginPage() {
    this.navCtrl.navigateRoot("/login");
  }*/
} 
