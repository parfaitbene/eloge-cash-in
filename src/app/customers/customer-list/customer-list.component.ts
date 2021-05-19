import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  customersSubscription: Subscription;

  constructor(
      private customerService: CustomerService,
      public actionSheetController: ActionSheetController,
      private navController: NavController
    ) {}

  ngOnInit() {
    this.customersSubscription = this.customerService.customersSubject.subscribe(
      (customers: Customer[]) => { 
        this.customers = customers.sort(); 
      }
    );
    this.customerService.emitCustomersList();

    this.initLiveSearch();
  }

  initLiveSearch(){
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }

  handleInput(event) {
    const items: any = Array.from(document.querySelector('ion-list').children);
    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  onExport(){
    const wb = XLSX.utils.book_new();
    const wsname: string = 'Clients-';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.customers);
    XLSX.utils.book_append_sheet(wb, ws, wsname);
    XLSX.writeFile(wb, wsname+'.xlsx');
  }

  async initActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [{
        text: 'Vider',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.customerService.setCustomers([]);
        }
      }, {

        text: 'Importer',
        icon: 'cloud-upload',
        handler: () => {
          this.navController.navigateForward(['tabs', 'clients', 'import']);
        }
      }, {
        text: 'Exporter',
        icon: 'cloud-download',
        handler: () => {
          this.onExport()
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }
}
