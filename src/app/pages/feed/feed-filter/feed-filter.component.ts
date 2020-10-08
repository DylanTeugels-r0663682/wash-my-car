import { SharedService } from './../../../services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed-filter',
  templateUrl: './feed-filter.component.html',
  styleUrls: ['./feed-filter.component.scss'],
})
export class FeedFilterComponent implements OnInit {


  distance = '20';

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    window.localStorage.getItem('distance') ? this.distance = window.localStorage.getItem('distance') : '20';
  }

  filterDistance(distance){
    this.sharedService.change(distance);
  }

}
