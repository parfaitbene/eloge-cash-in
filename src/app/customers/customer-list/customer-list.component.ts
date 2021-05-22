import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionLineCreateComponent } from 'src/app/collections/collection-line-create/collection-line-create.component';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal-service';
import * as XLSX from 'xlsx';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  @Input() willAddLine: boolean = false;
  @Input() collection;
  choice: Customer;
  newCustomer: Customer;
  customers: Customer[] = [];
  customersSubscription: Subscription;

  constructor(
      private customerService: CustomerService,
      public actionSheetController: ActionSheetController,
      private navController: NavController,
      public modalController: ModalController,
      public modalService: ModalService
    ) {}

  async ngOnInit() {
    this.customersSubscription = this.customerService.customersSubject.subscribe(
      (customers: Customer[]) => { 
        this.customers = customers.sort(); 
      }
    );
    this.customerService.emitCustomersList();

    await this.initLiveSearch();
  }

  onAddCustomerModal() {
    let options = {
      component: CustomerCreateComponent,
      componentProps: {
        'customer': this.newCustomer
      }
    };

    this.modalService.presentModal(options);
  }

  async onChoice(customer: Customer) {
    this.choice = customer;

    if(this.willAddLine) {
      const modal = await this.modalController.create({
        component: CollectionLineCreateComponent,
        componentProps: {
          'collection': this.collection,
          'customer': this.choice
        }
      });
      
      return await modal.present();
    }
    else {
      //afficher les détails
    }

  }

  async initLiveSearch(){
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }

  handleInput(event) {
    const items: any = Array.from(document.querySelector('ion-list#customers').children);
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

  onCancel() {
    this.modalController.dismiss();
    this.willAddLine = false;
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }
}
