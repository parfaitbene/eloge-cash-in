import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customer-import',
  templateUrl: './customer-import.page.html',
  styleUrls: ['./customer-import.page.scss'],
})
export class CustomerImportPage implements OnInit, OnDestroy {
  fileToUpload: any;
  customers: Customer[] = [];
  count: number = 0;
  customersSubscription: Subscription;
  datas: any[];

  constructor(private customerService: CustomerService, private navCtrl: NavController) { }

  ngOnInit() {
    this.customersSubscription = this.customerService.customersSubject.subscribe(
      (customers: Customer[]) => { 
        this.customers = customers.sort(); 
      }
    );
    this.customerService.emitCustomersList();
  }

  onFileSelected(event) {
    if(event.target.files.length){
      this.fileToUpload = event.target.files[0];
      this.onImport(event);
    }
  }

  onImport(evt) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.datas = (XLSX.utils.sheet_to_json(ws));
      this.count = this.datas.length;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  parseDatas(datas: any[]) {
    datas.forEach(row => {
      let customer = new Customer(row.prenom, row.nom, row.matricule);
      customer.phone = row.phone;
      customer.email = row.email;
      
      this.customerService.updateOrCreate(customer);
    });

  }

  onSave(){
    this.parseDatas(this.datas);
    this.customerService.setCustomers(this.customers);
    this.navCtrl.navigateRoot('/tabs/clients');
  }
  
  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }
}
