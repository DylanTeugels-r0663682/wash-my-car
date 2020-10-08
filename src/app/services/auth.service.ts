import { Controls } from './../controls';
import { resolve } from 'url';
import { MyCarsPageModule } from './../pages/my-cars/my-cars.module';
import { MyCarsPage } from './../pages/my-cars/my-cars.page';
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import firebase from 'firebase';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { User } from '../models/user';
import { Geolocation} from '@ionic-native/geolocation/ngx';

const { Storage } = Plugins;


@Injectable()
export class AuthService {

	private users: Array<any>;
	private loggedInUser: any;
	public userCars: any;
	public currentLat;
	public currentLon;

	constructor(
		private db: AngularFireDatabase, 
		public navCtrl: NavController, 
		public afAuth: AngularFireAuth,
		public helper: Controls,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		private geoLocation: Geolocation,
	){
	}


	//Authentication 
	register(user: User, password: string) {
		this.helper.showLoading("You are being registered...");
		return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
			this.afAuth.createUserWithEmailAndPassword(user.email, password)
			.then(
				res => resolve(res),
				err => reject(err)
			)
			.then(
				() => this.helper.loadingCtrl.dismiss()
			)
		})
		.then(
			cred => this.db.object("/users/" + cred.user.uid).set({
				id: cred.user.uid,
				username: user.username,
				email: user.email.toLowerCase().trim(),
				tel: user.tel,
				city: user.address.city,
				street: user.address.street,
				number: user.address.number
			})
		)
		.then(
			() => this.navCtrl.navigateRoot("/login")
		)
		.then(
			() => firebase.auth().currentUser.sendEmailVerification()
		)
		.then(
			() => this.helper.showToast("You have been registered successfully")
		)
	}

	login(email: string, password: string) {
		this.users = this.getUsers();
		this.helper.showLoading("Logging in...")
		return new Promise<any>((resolve, reject) => {
			this.afAuth.signInWithEmailAndPassword(email, password)
				.then(
					res => firebase.auth().currentUser.emailVerified ? resolve(res) : this.helper.showToast("Email not verified"),
					err => this.helper.showToast(err.message)
				)
				.then(
					() => this.helper.loadingCtrl.dismiss()
				)
				.then(
					() => this.geoLocation.watchPosition().subscribe(
						location => {
							this.currentLat = location.coords.latitude,
							this.currentLon = location.coords.longitude
						}
					)
				)
				.then(
					() => this.loggedInUser = this.getUserWithID(firebase.auth().currentUser.uid)
				)
		})
	}

	logout(){
		this.helper.showLoading('Logging out...')
		return new Promise<any>((resolve, reject) => {
			this.afAuth.signOut().then(() => {
				this.navCtrl.navigateRoot("/login"),
				this.helper.loadingCtrl.dismiss()
			})
		})
	}

	forgotPassword(email){
		this.helper.showLoading("Sending reset link...");
		return new Promise<any>((resolve, reject) => {
			this.afAuth.sendPasswordResetEmail(email)
			.then(
				res => this.helper.showToast("Reset link sent successfully"),
				err => this.helper.showToast(err.message)
			).then(
				() => this.helper.loadingCtrl.dismiss()
			)
		})
	}

	//----
	
	getLoggedInUser(){
		return this.loggedInUser;
	}

	// Subscribes to users in Firebase
	async retrieveUsers() {
		await this.db.list('users/').valueChanges().subscribe(
			data => {
				this.users = data;
			}
		)
	}

	// Returns a list of users
	getUsers() {
		this.retrieveUsers();
		return this.users;
	}

	// Returns user object with given email
	getUserID(email) {
		var returnKey;
		firebase.database().ref("users").once("value", function (snapshot) {
			snapshot.forEach(function (data) {
				if (data.child("email").val() == email) {
					returnKey = data.key;
					return true;
				}
			});
		});
		return returnKey;
	}

	getUserWithID(userID) {
		let returnKey;
		firebase.database().ref("users").once("value", function (snapshot) {
			snapshot.forEach(function (data) {
				if (data.key == userID) {
					returnKey = data.val();
					return true;
				}
			});
		})
		return returnKey;
	}

	getUser(uid: string){
		return new Promise<any>((resolve, reject) => {
			firebase.database().ref("users/" + uid).on("value", function(user) {
				resolve(user.val())
			})
		})
	}
}
