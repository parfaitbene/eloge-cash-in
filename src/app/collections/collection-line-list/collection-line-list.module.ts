import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionLineListPageRoutingModule } from './collection-line-list-routing.module';

import { CollectionLineListPage } from './collection-line-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionLineListPageRoutingModule
  ],
  declarations: []
})
export class CollectionLineListPageModule {}
