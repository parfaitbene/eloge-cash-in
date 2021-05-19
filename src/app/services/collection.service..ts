import { Subject } from "rxjs";
import { CollectionLine } from "../models/collection-line.model";
import { Collection } from "../models/collection.model";
import { Customer } from "../models/customer.model";

export class CollectionService {
    private collections: Collection[] = [];
    private collectionsLines: CollectionLine[] = [];
    collectionsSubject = new Subject<Collection[]>();
    collectionsLinesSubject = new Subject<CollectionLine[]>();

    constructor(){
    }

    emitCollectionsList(){
        this.collectionsSubject.next(this.collections);
        this.collectionsLinesSubject.next(this.collectionsLines);
    }
    
    emitCollectionsLinesList(){
        this.collectionsLinesSubject.next(this.collectionsLines);
        this.collectionsSubject.next(this.collections);
    }

    setCollections(collections: Collection[]) {
        this.collections = collections;
        this.emitCollectionsList();
    }

    setCollectionsLines(collectionsLines: CollectionLine[]) {
        this.collectionsLines = collectionsLines;
        this.emitCollectionsLinesList();
    }

    getCollectionByName(name: string){
        const collection: Collection = this.collections.find(
            (c) => {
                return c.name == name;
            }
        );

        return collection;
    }
}