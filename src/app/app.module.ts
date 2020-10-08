import { Controls } from './controls';
//basics
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';


//pages
import { SettingsPage } from './pages/settings/settings.page';
import { MyProfilePage } from './pages/my-profile/my-profile.page';
import { AddCarPage } from './pages/add-car/add-car.page';
import { MyCarsPage } from './pages/my-cars/my-cars.page';
import { FeedPage } from './pages/feed/feed.page';
import { TabsPage } from './pages/tabs/tabs.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

//services
import { AuthService } from 'src/app/services/auth.service';

//access DB
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';

//firebase database connection
import { environment } from '../environments/environment';

//forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { RouteReuseStrategy, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Geolocation} from '@ionic-native/geolocation/ngx'
import { NativeGeocoder, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';


@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app
    AngularFirestoreModule, // imports firebase/firestore
    AngularFireAuthModule, // imports firebase/auth
    AngularFireStorageModule, // imports firebase/storage
    AngularFireDatabaseModule,
  ],

  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    WebView,
    AngularFireDatabase,
    AuthService,
    Geolocation,
    NativeGeocoder,
    Controls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
