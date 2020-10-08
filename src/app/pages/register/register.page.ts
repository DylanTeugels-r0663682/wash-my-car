import { Controls } from './../../controls';
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { NavController, LoadingController } from "@ionic/angular";
import citiesData from '../../json/cities.json'
import { User } from 'src/app/models/user';
import firebase from 'firebase';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {

  //Form input values
  user: User = {
     id: "",
     username: "",
     email: "",
     tel: "",
     address: {
        city: "",
        street: "",
        number: ""
     },
     reviews: []
  }
  password: string;
  confirmPassword: string;

  cities = citiesData;

  //Form validations
  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  validation_messages = {
    username: [
      { type: "required", message: "Username is required." },
      { type: "pattern", message: "Enter a valid username" },
    ],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    tel: [
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

  constructor( 
    private navCtrl: NavController, 
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    public helper: Controls ) {
  }

  ngOnInit() {
    this.formValidator();
  }
  
  formValidator(){
    this.validations_form = this.formBuilder.group({
      username: new FormControl(
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
      tel: new FormControl(
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

  

  tryRegister() {
    this.authService.register(this.user, this.password)
     .then(res => {
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       this.helper.showToast(err.message)
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  //nav
  goLoginPage() {
    this.navCtrl.navigateRoot("/login");
  }
} 
