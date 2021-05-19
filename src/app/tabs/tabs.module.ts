import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { CustomerListComponent } from '../customers/customer-list/customer-list.component';
import { CollectionLineListPage } from '../collections/collection-line-list/collection-line-list.page';
import { CollectionListComponent } from '../collections/collection-list/collection-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
    CollectionListComponent,
    CollectionLineListPage,
    CustomerListComponent,]
})
export class TabsPageModule {}
