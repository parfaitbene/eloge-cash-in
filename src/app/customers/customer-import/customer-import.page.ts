import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customer-import',
  templateUrl: './customer-import.page.html',
  styleUrls: ['./customer-import.page.scss'],
})
export class CustomerImportPage implements OnInit {
  fileToUpload: any;
  customers: Customer[] = [];
  count: number = 0;

  constructor(private customerService: CustomerService, private navCtrl: NavController) { }

  ngOnInit() {
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
      let datas: any[] = (XLSX.utils.sheet_to_json(ws));
      this.count = datas.length;
      this.parseDatas(datas)
    };
    reader.readAsBinaryString(target.files[0]);
  }

  parseDatas(datas: any[]) {
    datas.forEach(row => {
      let customer = new Customer(row.prenom, row.nom, row.compte);
      customer.phone = row.phone;
      customer.email = row.email;
      this.customers.push(customer);
    });
  }

  onSave(){
    this.customerService.setCustomers(this.customers);
    this.navCtrl.navigateRoot('/tabs/clients');
  }
}
