import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collection } from 'src/app/models/collection.model';
import { Customer } from 'src/app/models/customer.model';
import { CollectionService } from 'src/app/services/collection.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal-service';
import { Subscription } from 'rxjs';
import { CollectionLine } from 'src/app/models/collection-line.model';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
  providers: [FormBuilder]
})
export class CustomerCreateComponent implements OnInit {
  @Input() customerInfo: Customer;
  @Input() isUpdate: boolean = false;
  customer: Customer;
  myForm: FormGroup;
  collections: Collection[] = [];
  collectionsSubscription: Subscription;
  collectionLineSubscription: Subscription;

  constructor(
    private customerService: CustomerService,
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    public modalService: ModalService
    ) { }


  ngOnInit() {
    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => {
        this.collections = collections.sort();
      }
    );

    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      firstName: [this.isUpdate?this.customerInfo.firstName:''],
      name: [this.isUpdate?this.customerInfo.name:'', Validators.required],
      email: [this.isUpdate?this.customerInfo.email:'', Validators.email],
      phone: [this.isUpdate?this.customerInfo.phone:''],
      accountNumber: [this.isUpdate?this.customerInfo.accountNumber:'', Validators.required]
    });
  }

  onSave() {
    let formValue = this.myForm.value;
    this.customer = new Customer(formValue['firstName'], formValue['name'], formValue['accountNumber'],formValue['phone'],formValue['email']);


    if(!this.isUpdate){
      this.customerService.createCustomer(this.customer).then(
        (customer: Customer) => {
          this.customer = customer;
          let options = {
            'customer': customer
          };
          this.modalService.dismissModal(options);
        }
      );
    }else{
      // this.customer.id=this.customerInfo.id;
      let customer = new Customer(formValue['firstName'], formValue['name'], formValue['accountNumber'],formValue['phone'],formValue['email']);
      customer.id = this.customerInfo.id;
      console.log("IN UUUUUUPDATE")
      this.customerService.updateCustomer(customer);
    }

  }

  async onDelete(){
    await this.customerService.deleteCustomer(this.customerInfo)
      // this.customerService.loadCustomersList();
      // this.customerService.emitCustomersList();
      // this.modalService.dismissModal();
      // this.collectionService.loadCollectionLineList();
      // this.collectionService.emitCollectionsLinesList();

      // this.collectionLineSubscription = this.collectionService.collectionsLinesSubject.subscribe(
      //   (collectionLines: CollectionLine[]) => {

      //     for(let collection of this.collections){
      //       if(collection && collection.id){
      //         let lines = [];

      //         collectionLines.forEach(line => {
      //             if(line.collection.id == collection.id) { lines.push(line); }
      //         });

      //         collection.lines = lines

      //       }
      //     }

      //   }

      // );
  }

  dismissModal() {
    this.modalService.dismissModal();
  }
}
