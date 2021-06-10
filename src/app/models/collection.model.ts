import {v4 as uuidv4} from 'uuid';
import { CollectionLine } from './collection-line.model';

export class Collection {
    id: string;
    name: string;
    date: String;
    lines: CollectionLine[] = [];

    constructor(name: string, lines: CollectionLine[] = [], date: string = new Date().toLocaleDateString()){
        this.name = name;
        this.lines = lines;
        this.date = date;
    }

    create() {
        this.id = uuidv4();
        let date:Date = new Date();
        this.date= date.toLocaleDateString();
        // this.date = new Date();

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
