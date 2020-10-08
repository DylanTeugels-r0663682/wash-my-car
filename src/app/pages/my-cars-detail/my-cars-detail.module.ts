import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCarsDetailPageRoutingModule } from './my-cars-detail-routing.module';

import { MyCarsDetailPage } from './my-cars-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCarsDetailPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MyCarsDetailPage]
})
export class MyCarsDetailPageModule {}
