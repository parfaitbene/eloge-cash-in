import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionLine } from 'src/app/models/collection-line.model';
import { Collection } from 'src/app/models/collection.model';
import { Customer } from 'src/app/models/customer.model';
import { CollectionService } from 'src/app/services/collection.service.';
import { CustomerService } from 'src/app/services/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-line-import',
  templateUrl: './collection-line-import.page.html',
  styleUrls: ['./collection-line-import.page.scss'],
  providers: [NavParams]
})
export class CollectionLineImportPage implements OnInit {
  collection: Collection;
  customers: Customer[] = [];
  collections: Collection[] = [];
  customersSubscription: Subscription;
  collectionsSubscription: Subscription;
  fileToUpload: any;
  collectionsLines: CollectionLine[] = [];
  count: number = 0;

  constructor(
    private collectionService: CollectionService, 
    private customerService: CustomerService,
    public navParams: NavParams,
    private navCtrl: NavController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.customersSubscription = this.customerService.customersSubject.subscribe(
      (customers: Customer[]) => { 
        this.customers = customers.sort(); 
      }
    );
    this.customerService.emitCustomersList();

    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => { 
        this.collections = collections.sort(); 
      }
    );
    this.collectionService.emitCollectionsList();
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.collection = this.collectionService.getCollectionByName(params['collection_name']);
    });
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
    if(!this.customers.length){ this.createCustomers(datas); }
    let collection: Collection = this.collectionService.getCollectionByName(this.navParams.get('collection_name'));
    collection = collection? collection : this.createCollection();

    datas.forEach(row => {
      let customer: Customer = this.customerService.getCustomerByFirstNameAndName(row.prenom, row.nom);
      let line = new CollectionLine(collection, customer, row.montant);
      collection.lines.push(line);
      this.collectionsLines.push(line);
    });
  }

  createCollection() {
    let today = new Date();
    const name: string = 'Importation du '+today.getFullYear().toString()+'-'+today.getMonth().toString()+'-'+today.getDate().toString();
    const collection = new Collection(name);
    this.collections.push(collection);
    this.collectionService.setCollections(this.collections);

    return collection;
  }

  createCustomers(datas: any[]) {
    let customers: Customer[] = [];

    datas.forEach(row => {
      let customer: Customer = new Customer(row.prenom, row.nom, row.compte);
      customers.push(customer);
    });

    this.customerService.setCustomers(customers);
  }

  onSave(){
    this.collectionService.setCollectionsLines(this.collectionsLines);
    this.navCtrl.navigateRoot('/tabs/collections/lines');
  }
}
