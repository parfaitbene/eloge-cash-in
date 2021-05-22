import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionLineListPageRoutingModule } from './collection-line-list-routing.module';

import { CollectionLineListPage } from './collection-line-list.page';
import { CollectionLineCreateComponent } from '../collection-line-create/collection-line-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionLineListPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    CollectionLineCreateComponent
  ]
})
export class CollectionLineListPageModule {}
