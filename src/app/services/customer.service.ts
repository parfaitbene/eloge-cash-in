import { Subject } from "rxjs";
import { Customer } from "../models/customer.model";
import {v4 as uuidv4} from 'uuid';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private customers: Customer[] = [];
    customersSubject = new Subject<Customer[]>();

    constructor(){
    }

    emitCustomersList(){
        this.customersSubject.next(this.customers);
    }

    setCustomers(customers: Customer[]) {
        this.customers = customers;
        this.emitCustomersList();
    }

    getCustomerByFirstNameAndName(firstName: string, name: string){
        const customer: Customer | undefined = this.customers.find(
            (c) => {
                return c.firstName === firstName && c.name == name;
            }
        );

        return customer;
    }

    updateOrCreate(newCustomer: Customer) {
        return new Promise(
            (resolve, reject) => {
                let customer = this.getCustomerByFirstNameAndName(newCustomer.firstName, newCustomer.name);

                if(customer !== undefined) {
                    newCustomer.id = customer.id;
                    this.customers[this.customers.indexOf(customer)] = newCustomer;
                    resolve(customer);
                }
                else {
                    resolve(this.createCustomer(newCustomer));
                }
            }
        );
    }

    createCustomer(customer: Customer) {
        return new Promise(
            (resolve, reject) => {
                customer.id = uuidv4();
                this.customers.push(customer);
                this.emitCustomersList();
                resolve(customer);
            }
        );
    }
}
