import { Subject, Subscription } from "rxjs";
import { CollectionLine } from "../models/collection-line.model";
import { Collection } from "../models/collection.model";
import {v4 as uuidv4} from 'uuid';
import { Plugins } from '@capacitor/core';

import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { CustomerService } from "./customer.service";
import { ModalService } from "./modal-service";
import { UserService } from "./user.service";
import { User } from "../models/user.model";
const { CapacitorSQLite} = Plugins;


@Injectable({
  providedIn: 'root'
})
export class CollectionService {
    private collections: Collection[] = [];
    private collectionsLines: CollectionLine[] = [];
    collectionsSubject = new Subject<Collection[]>();
    collectionsLinesSubject = new Subject<CollectionLine[]>();
    user:User;
    userSubscription: Subscription;

    constructor(public databaseService: DatabaseService,private customerService: CustomerService,public modalService: ModalService,public userService: UserService){
       this.loadCollectionList();
       this.loadCollectionLineList();
       this.userSubscription= this.userService.userSubject.subscribe(
         (user:User)=>{
           this.user=user;
         }
       )
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
      console.log("in LOAD COLLECTION LIST");
      this.collections=[];
        this.databaseService.getCollectionList().subscribe(
            res => {
                res.values.forEach(c => {
                    let collection = new Collection(c.name, [], c.date);
                    collection.id = c.id_collection;
                    this.collections.push(collection);
                    this.emitCollectionsList();
                });

            }
        );
    }

    loadCollectionLineList() {
      console.log("in LOAD COLLECTION LINE LIST");
      this.collectionsLines=[];
        this.databaseService.getCollectionLineList().subscribe(
            res => {
                res.values.forEach(c => {
                    var collection=this.getCollectionById(c.id_collecte);
                    var customer=this.customerService.getCustomerById(c.id_customer);

                    let collectionLine = new CollectionLine(collection,customer,c.amount,c.date);
                    collectionLine.id = c.id_collection_line;
                    this.collectionsLines.push(collectionLine);
                    this.emitCollectionsLinesList();
                    console.log('eeeeeee',collectionLine.id);
                    console.log('ttttt',collectionLine.amount);
                    console.log('rrrrrr',collectionLine.collection.name);
                    console.log('ffffff',collectionLine.customer.name);
                });

            }
        );
    }

   async persistCollections(collection:Collection,id:String) {
        // Complete persist code here
        console.log("IN PERSIST COLLECTION",collection.name);
        console.log("IN PERSIST COLLECTION USER ID",id);
        const statement = `INSERT INTO collection (id_collection, name, date, id_user) VALUES ('${collection.id}','${collection.name}', '${collection.date}', '${id}');`;
        await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
        console.log('Insertion.......');
        this.loadCollectionList();
        this.emitCollectionsList();
    }

    async persistCollectionsLines(collectionLine:CollectionLine) {
        // Complete persist code here
        console.log("IN PERSIST COLLECTION LINE",collectionLine.amount);
        const statement = `INSERT INTO collection_line (id_collection_line, amount, date, id_customer, id_collecte) VALUES ('${collectionLine.id}','${collectionLine.amount}', '${collectionLine.date}', '${collectionLine.customer.id}', '${collectionLine.collection.id}');`;
        await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
        console.log('Insertion.......');
        this.loadCollectionLineList();
        this.emitCollectionsLinesList();

    }

    async deleteCollection(collection) {

      console.log("IN DELETE collection");
      const statement = `DELETE FROM collection WHERE id_collection='${collection.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCollectionList();
      this.emitCollectionsList();
      this.modalService.dismissModal();
        // return new Promise(
        //     (resolve, reject) => {
        //         try{
        //             this.collections.find(
        //                 (c, index) => {
        //                     if(c.id == collection.id){
        //                         this.collections.splice(index, 1);
        //                         //this.persistCollections();
        //                         this.deleteCollectionLines(collection);
        //                     }
        //                 }
        //             );
        //             resolve(true);
        //         }
        //         catch(e){ reject(false); }

        //     }
        // )
    }

    async deleteCollectionLine(collectionLine: CollectionLine){
      console.log("IN DELETE collectionLine");
      const statement = `DELETE FROM collection_line WHERE id_collection_line='${collectionLine.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCollectionLineList();
      this.emitCollectionsLinesList();
      this.modalService.dismissModal();
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
                                            // this.persistCollectionsLines();

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

    async deleteAllCollections() {
      console.log("IN DELETE collection");
      const statement = `DELETE FROM collection;`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCollectionList();
      this.emitCollectionsList();

        // this.setCollections([]);
        // //this.persistCollections();
        // this.deleteAllCollectionsLines();
    }

    async deleteAllCollectionsLines(collection:Collection) {
      console.log("IN DELETE collectionLine");
      const statement = `DELETE FROM collection_line WHERE id_collecte='${collection.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      this.loadCollectionLineList();
      this.emitCollectionsLinesList();

        // this.setCollectionsLines([]);
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

    async updateCollectionLine(collectionLine:CollectionLine) {
      // Complete persist code here
      console.log("IN UPDATE collectionLine");
      console.log('collectionLine amount',collectionLine.amount);

      const statement = `DELETE FROM collection_line WHERE id_collection_line='${collectionLine.id}';`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
      const statement2 = `INSERT INTO collection_line (id_collection_line,amount, date, id_customer, id_collecte) VALUES ('${collectionLine.id}','${collectionLine.amount}','${collectionLine.date}', '${collectionLine.customer.id}', '${collectionLine.collection.id}');`;
      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement2 });
      console.log('Update.......');
      this.loadCollectionLineList();

  }


   createCollection(newCollection: Collection) {
      console.log("IN COLLECTION CREATE",newCollection.name);
      console.log("IN COLLECTION CREATE date",newCollection.date);
        return new Promise(
            (resolve, reject) => {
                newCollection.id = uuidv4();
                console.log("IN COLLECTION TAB",this.collections);
                this.persistCollections(newCollection,this.user.id);
                resolve(newCollection);
            }
        );
    }

   createCollectionLine(newCollectionLine: CollectionLine) {
      console.log("IN COLLECTION LINE CREATE",newCollectionLine.amount);
        return new Promise(
            async(resolve, reject) => {
                newCollectionLine.id = uuidv4();
                //this.collectionsLines.push(newCollectionLine);
                this.persistCollectionsLines(newCollectionLine);
                // newCollectionLine.collection.lines.push(newCollectionLine);
                resolve(newCollectionLine);
            }
        );
    }
}
