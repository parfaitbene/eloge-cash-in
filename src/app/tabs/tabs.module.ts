import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { CustomerListComponent } from '../customers/customer-list/customer-list.component';
import { CollectionLineListPage } from '../collections/collection-line-list/collection-line-list.page';
import { CollectionListComponent } from '../collections/collection-list/collection-list.component';
import { CustomerCreateComponent } from '../customers/customer-create/customer-create.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    TabsPage,
    CollectionListComponent,
    CollectionLineListPage,
    CustomerListComponent,
    CustomerCreateComponent
  ]
})
export class TabsPageModule {}
