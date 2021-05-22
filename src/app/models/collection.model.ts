import {v4 as uuidv4} from 'uuid';
import { CollectionLine } from './collection-line.model';

export class Collection {
    id: string;
    name: string;
    date: Date;
    lines: CollectionLine[] = [];

    constructor(name: string, lines: CollectionLine[] = [], date: Date = new Date()){
        this.name = name;
        this.lines = lines;
        this.date = date;
    }

    create() {
        this.id = uuidv4();
        this.date = new Date();

        return this;
    }

    getTotal(){
        let total = 0;

        this.lines.forEach(line => {
            total += line.amount;
        });

        return total;
    }
}