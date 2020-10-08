import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private activeChild: any = "";

  constructor(private navCtrl: NavController, private authService: AuthService) {
  }

  ngOnInit() {
  }

}
