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
import { CollectionService } from '../services/collection.service';
import { Tab3Page } from '../tab3/tab3.page';

@NgModule({
  providers:[
    CollectionService
  ],
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
    CustomerCreateComponent,
    Tab3Page
  ],
  exports:[
    Tab3Page
  ]
})
export class TabsPageModule {
  constructor(){
    console.log("IN TABS MODULE");
  }
}
