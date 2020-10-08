import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCarsDetailPage } from './my-cars-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MyCarsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCarsDetailPageRoutingModule {}
