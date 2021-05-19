import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionLineImportPage } from './collection-line-import.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionLineImportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionLineImportPageRoutingModule {}
