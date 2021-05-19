import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionImportPageRoutingModule } from './collection-import-routing.module';

import { CollectionImportPage } from './collection-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionImportPageRoutingModule
  ],
  declarations: [CollectionImportPage]
})
export class CollectionImportPageModule {}
