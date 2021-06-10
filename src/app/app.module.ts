import { NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionService } from './services/collection.service';
import { CustomerService } from './services/customer.service';
import { DatabaseService } from './services/database.service';
import { ModalService } from './services/modal-service';
import { UserService } from './services/user.service';
import { Tab3Page } from './tab3/tab3.page';
import { TabsPageModule } from './tabs/tabs.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, TabsPageModule],
  providers: [
    UserService,
    CollectionService,
    CustomerService,
    ModalService,
    DatabaseService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnDestroy {
  isSetupDoneSubscription: Subscription;

  constructor(private databaseService:DatabaseService,public modalService: ModalService){
    console.log("IN APP MODULE");
    this.isSetupDoneSubscription = this.databaseService.isSetupDoneSubject.subscribe(
      async(isSetup: Boolean) => {
        console.log("IN APPCOMPONENT SUBSCRIPTION");
        if(!isSetup){

          let options = {
            component: Tab3Page,
            componentProps: {
              'firstConnection': true
            }
          };

          this.modalService.presentModal(options);
        }

      }
    );

  }



  ngOnDestroy() {
    this.isSetupDoneSubscription.unsubscribe();
  }


}
