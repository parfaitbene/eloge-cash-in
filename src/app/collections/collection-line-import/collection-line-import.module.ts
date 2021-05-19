import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionLineImportPageRoutingModule } from './collection-line-import-routing.module';

import { CollectionLineImportPage } from './collection-line-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionLineImportPageRoutingModule
  ],
  declarations: [CollectionLineImportPage]
})
export class CollectionLineImportPageModule {}
