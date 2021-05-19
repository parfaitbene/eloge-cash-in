import {v4 as uuidv4} from 'uuid';
import { CollectionLine } from './collection-line.model';

export class Collection {
    id: string;
    name: string;
    date: Date;
    lines: CollectionLine[] = [];

    constructor(name: string){
        // this.id = uuidv4();
        this.name = name;
        // this.date = new Date();
        // this.lines = [];
    }

    getTotal(){
        let total = 0;

        this.lines.forEach(line => {
            total += line.amount;
        });

        return total;
    }
}