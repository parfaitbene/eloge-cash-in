import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerImportPage } from './customer-import.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerImportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerImportPageRoutingModule {}
