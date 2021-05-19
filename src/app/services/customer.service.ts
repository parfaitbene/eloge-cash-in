import { Subject } from "rxjs";
import { Customer } from "../models/customer.model";

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
        const customer: Customer = this.customers.find(
            (c) => {
                return c.firstName === firstName && c.name == name;
            }
        );

        return customer;
    }
}