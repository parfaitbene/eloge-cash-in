import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerImportPageRoutingModule } from './customer-import-routing.module';

import { CustomerImportPage } from './customer-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CustomerImportPageRoutingModule
  ],
  declarations: [CustomerImportPage]
})
export class CustomerImportPageModule {}
