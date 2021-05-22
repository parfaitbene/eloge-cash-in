import { Collection } from './collection.model';
import { Customer } from './customer.model';

export class CollectionLine {
    id: string;
    collection: Collection;
    customer: Customer;
    amount: number = 0;
    date: Date;

    constructor(collection: Collection, customer: Customer, amount: number, date: Date = new Date()){
        this.collection = collection;
        this.customer = customer;
        this.amount = amount;
        this.date = date;
    }
}