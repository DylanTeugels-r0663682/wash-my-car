import { FeedFilterComponent } from './feed-filter/feed-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedPageRoutingModule } from './feed-routing.module';

import { FeedPage } from './feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedPageRoutingModule
  ],
  entryComponents: [FeedFilterComponent,],
  declarations: [FeedPage, FeedFilterComponent]
})
export class FeedPageModule {}
