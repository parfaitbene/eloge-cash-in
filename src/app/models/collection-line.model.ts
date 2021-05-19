import { Collection } from './collection.model';
import { Customer } from './customer.model';
import {v4 as uuidv4} from 'uuid';

export class CollectionLine {
    id: string;
    collection: Collection;
    customer: Customer;
    amount: number = 0;
    date: Date;

    constructor(collection: Collection, customer: Customer, amount: number){
        // this.id = uuidv4();
        this.collection = collection;
        this.customer = customer;
        this.amount = amount;
        // this.date = new Date();
    }
}