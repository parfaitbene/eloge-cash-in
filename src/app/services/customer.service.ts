import { Subject } from "rxjs";
import { Customer } from "../models/customer.model";
import {v4 as uuidv4} from 'uuid';
import { Injectable } from "@angular/core";
import { Plugins } from '@capacitor/core';
const { CapacitorSQLite} = Plugins;
import { DatabaseService } from "./database.service";
import { ModalService } from "./modal-service";
import { CollectionService } from "./collection.service";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private customers: Customer[] = [];
    customersSubject = new Subject<Customer[]>();

    constructor(public databaseService: DatabaseService,public modalService: ModalService){
      this.loadCustomersList();
    }

    loadCustomersList() {
      console.log("in LOAD CUSTOMER LIST");
      this.customers=[];
        this.databaseService.getCustomerList().subscribe(
            res => {
              console.log('VALEURS DE LA BD CUSTOMER',res.values)
                res.values.forEach(c => {
                    let customer = new Customer(c.firstname,c.name,c.accountNumber,c.phone,c.email)
                    customer.id = c.id_customer;

                    this.customers.push(customer);
                    this.emitCustomersList();
                });
            }
        );
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

    getCustomerById(id: string){
      let customer: Customer= this.customers.find(
          (c, index) => {
              return c.id == id;
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

  async persistCustomers(customer:Customer) {
      // Complete persist code here
      console.log("IN PERSIST CUSTOMER",customer.name);
      const statement = `INSERT INTO customer (id_customer, firstname, name, email, phone, accountnumber) VALUES ('${customer.id}','${customer.firstName}', '${customer.name}', '${customer.email}', '${customer.phone}', '${customer.accountNumber}');`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      // this.loadCustomersList();
      this.customers.push(customer);
      console.log('Insertion Customer.......');

      this.emitCustomersList();
  }

    createCustomer(customer: Customer) {
        return new Promise(
            (resolve, reject) => {
                customer.id = uuidv4();
                this.persistCustomers(customer);
                // this.customers.push(customer);
                // this.emitCustomersList();
                resolve(customer);
            }
        );
    }

    async deleteCustomer(customer:Customer){
      console.log("IN DELETE customer");
      const statement = `DELETE FROM customer WHERE id_customer='${customer.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCustomersList();
      this.emitCustomersList();
      this.modalService.dismissModal();
    }

    async deleteCustomers(){
      console.log("IN DELETE customers");
      const statement = `DELETE FROM customer;`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCustomersList();
      this.emitCustomersList();
    }

    async updateCustomer(customer:Customer) {
      // Complete persist code here
      console.log("IN UPDATE customer");
      console.log('customer first name',customer.accountNumber);
      console.log('customer first name',customer.firstName);
      console.log('customer name',customer.name);
      console.log('customer phone',customer.phone);
      console.log('this customer email',customer.email);
      // this.deleteCustomer(customer);
      // this.createCustomer(customer);
      const statement = `DELETE FROM customer WHERE id_customer='${customer.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      const statement2 = `INSERT INTO customer (id_customer,firstname, name, phone, email, accountnumber) VALUES ('${customer.id}','${customer.firstName}','${customer.name}', '${customer.phone}', '${customer.email}', '${customer.accountNumber}');`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement2 });
      console.log('Update.......');
      this.loadCustomersList();
      this.emitCustomersList();
      this.modalService.dismissModal();
  }

}
