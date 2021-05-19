import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionLineListPage } from './collection-line-list.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionLineListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionLineListPageRoutingModule {}
