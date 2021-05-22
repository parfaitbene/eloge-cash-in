import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ModalService } from 'src/app/services/modal-service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
  providers: [FormBuilder]
})
export class CustomerCreateComponent implements OnInit {
  customer: Customer;
  myForm: FormGroup;

  constructor( 
    private customerService: CustomerService,  
    private formBuilder: FormBuilder,
    public modalService: ModalService
    ) { }

  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.myForm = this.formBuilder.group({
      firstName: [''],
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      accountNumber: ['', Validators.required]
    });
  }

  onSave() {
    let formValue = this.myForm.value;
    this.customer = new Customer(formValue['firstName'], formValue['name'], formValue['accountNumber']);
    this.customer.email = formValue['email'];
    this.customer.phone = formValue['phone'];

    this.customerService.createCustomer(this.customer).then(
      (customer: Customer) => { 
        this.customer = customer; 
        let options = {
          'customer': customer
        };
        this.modalService.dismissModal(options);
      }
    );
  }

  dismissModal() {
    this.modalService.dismissModal();
  }
}
