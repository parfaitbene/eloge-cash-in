import { Subject } from "rxjs";
import { CollectionLine } from "../models/collection-line.model";
import { Collection } from "../models/collection.model";
import {v4 as uuidv4} from 'uuid';
import { Plugins } from '@capacitor/core';

import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
const { CapacitorSQLite} = Plugins;


@Injectable({
  providedIn: 'root'
})
export class CollectionService {
    private collections: Collection[] = [];
    private collectionsLines: CollectionLine[] = [];
    collectionsSubject = new Subject<Collection[]>();
    collectionsLinesSubject = new Subject<CollectionLine[]>();

    constructor(public databaseService: DatabaseService){
       this.loadCollectionList();
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

    getCollectionById(id: string){
        let collection: Collection = this.collections.find(
            (c, index) => {
                return c.id == id;
            }
        );

        return collection;
    }

    loadCollectionList() {
        this.databaseService.getCollectionList().subscribe(
            res => { 
                res.values.forEach(c => {
                    let collection = new Collection(c.name, [], c.date);
                    collection.id = c.id;
                    this.collections.push(collection);
                    this.emitCollectionsList();
                });
            }
        );
    }

    persistCollections(collection:Collection,email:String) {
        // Complete persist code here
        console.log("IN PERSIST COLLECTION",collection.name);
        const statement = `INSERT INTO collection (id_collection, name, date) VALUES ('${collection.id}','${collection.name}', '${collection.date}');`;
        CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
        console.log('Insertion.......');

        this.emitCollectionsList();
    }

    persistCollectionsLines() {
        // Complete persist code here
        this.emitCollectionsLinesList();
    }

    deleteCollection(collection) {
        return new Promise(
            (resolve, reject) => {
                try{
                    this.collections.find(
                        (c, index) => {
                            if(c.id == collection.id){
                                this.collections.splice(index, 1);
                                //this.persistCollections();
                                this.deleteCollectionLines(collection);
                            }
                        }
                    );
                    resolve(true);
                }
                catch(e){ reject(false); }

            }
        )
    }

    deleteCollectionLines(collection: Collection) {
        return new Promise(
            (resolve, reject) => {
                const updateCollection = this.collections.find(
                    (c, collection_index) => {
                        if(c.id == collection.id){
                            c.lines.forEach(line => {
                                this.collectionsLines.find(
                                    (l, line_index) => {
                                        if(l.id == line.id){
                                            this.collectionsLines.splice(line_index, 1);
                                            this.persistCollectionsLines();

                                            return l.id == line.id;
                                        }
                                    }
                                );
                            });

                            collection.lines = [];
                            this.collections[collection_index] = collection;
                            //this.persistCollections();
                        }
                        return c.id == collection.id;
                    }
                );

                resolve(updateCollection);
            }
        );
    }

    deleteAllCollections() {
        this.setCollections([]);
        //this.persistCollections();
        this.deleteAllCollectionsLines();
    }

    deleteAllCollectionsLines() {
        this.setCollectionsLines([]);
        this.persistCollectionsLines();
    }

    getCollectionLines(collection: Collection) {
        return new Promise(
            (resolve, reject) => {
                try{
                    if(collection && collection.id){
                        let lines = [];

                        this.collectionsLines.forEach(line => {
                            if(line.collection.id == collection.id) { lines.push(line); }
                        });

                        resolve(lines);
                    }
                }
                catch(e){
                    reject([]);
                }
            }
        )
    }

    createCollection(newCollection: Collection) {
      console.log("IN COLLECTION CREATE",newCollection.name);
      console.log("IN COLLECTION CREATE",newCollection.date);
        return new Promise(
            (resolve, reject) => {
                newCollection.id = uuidv4();
                console.log("IN COLLECTION TAB",this.collections);
                // this.collections.push(newCollection);
                this.persistCollections(newCollection,"tch@gmail.com");
                resolve(newCollection);
            }
        );
    }

    createCollectionLine(newCollectionLine: CollectionLine) {
        return new Promise(
            (resolve, reject) => {
                newCollectionLine.id = uuidv4();
                this.collectionsLines.push(newCollectionLine);
                this.persistCollectionsLines();
                newCollectionLine.collection.lines.push(newCollectionLine);
                //this.persistCollections();

                resolve(newCollectionLine);
            }
        );
    }
}
