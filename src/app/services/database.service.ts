import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { AlertController, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { JsonSQLite } from '@capacitor-community/sqlite';
import { BehaviorSubject, from, of, Subject } from 'rxjs';

import { db } from '../../assets/db';
import { Tab3Page } from '../tab3/tab3.page';


const { CapacitorSQLite, Device, Storage } = Plugins;

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';

var isReady:Boolean = false;


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public dbReady = new BehaviorSubject(false);
  private dbName = '';
  private isSetupDone;
  isSetupDoneSubject = new Subject<Boolean>();

  constructor(private alertCtrl: AlertController,public modalController: ModalController) { }

  getDBName() { return this.dbName; }

  getDBSetupKey() { return this.dbName; }

  async init(): Promise<Boolean> {
    const info = await Device.getInfo();
    console.log("IN APPCOMPONENT INIT",info.platform);
    if (info.platform === 'android') {
      console.log("IN APPCOMPONENT INIT if")
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        return this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: 'This app can\'t work without Database access.',
          buttons: ['OK']
        });
        await alert.present();
        return false;
      }
    } else {
      console.log("IN APPCOMPONENT INIT else")
       return this.setupDatabase();
    }
  }


  private async setupDatabase():Promise<Boolean> {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
    console.log("IN APPCOMPONENT SETUP")
    console.log("IN APPCOMPONENT SETUP done value",dbSetupDone.value)

    this.isSetupDone = (dbSetupDone.value == null)?false:true;

    this.isSetupDoneSubject.next(this.isSetupDone);

    if (!dbSetupDone.value) {
      console.log("IN APPCOMPONENT SETUP IF")
      this.downloadDatabase();
      return isReady;
    } else {
      console.log("IN APPCOMPONENT SETUP else")
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      await CapacitorSQLite.createConnection({database:this.dbName})
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);

      const dbExist = CapacitorSQLite.isDBExists({database: this.dbName});
      dbExist.then(
        (result) => {
          console.log('***************************22'+result.result);
        }
      );

      isReady = true;
      return isReady;

    }
  }


  private async downloadDatabase() {

      var jsonExport: JsonSQLite
      jsonExport = db;
      console.log("IN APPCOMPONENT Download",db);
      const jsonstring = JSON.stringify(jsonExport);
      console.log("IN APPCOMPONENT Download jsonstring",jsonstring)
      const isValid = await CapacitorSQLite.isJsonValid({jsonstring});
      console.log("IN APPCOMPONENT Download json",isValid);
      console.log("IN APPCOMPONENT Download json result",isValid.result);


      if (isValid.result) {
        console.log("IN APPCOMPONENT Download if");
        this.dbName = db.database;
        await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
        await CapacitorSQLite.importFromJson({ jsonstring });
        // await Storage.set({ key: DB_SETUP_KEY, value: '1' });
        await CapacitorSQLite.createConnection({database:this.dbName})
        await CapacitorSQLite.open({ database: this.dbName });

        // await this.onNewConnection();
        this.dbReady.next(true);


      }

  }

  // async onNewConnection() {
  //   const modal = await this.modalController.create({
  //     component: Tab3Page,
  //     componentProps: {
  //       'firstConnection': true
  //     }
  //   });

  //   return await modal.present();
  // }



  getCollectionList() {
    console.log("In get collection list")
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          console.log("In get collection list if")
          return of({ values: [] });
        } else {
          console.log("In get collection list else")
          const statement = 'SELECT * FROM collection;';
          return from(CapacitorSQLite.query({database: this.dbName, statement, values: [] }));
        }
      })
    )
  }

  getCustomerList() {
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = 'SELECT * FROM customer;';
          return from(CapacitorSQLite.query({database: this.dbName, statement, values: [] }));
        }
      })
    )
  }

  getUser() {
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = 'SELECT * FROM user;';
          return from(CapacitorSQLite.query({database: this.dbName, statement, values: [] }));
        }
      })
    )
  }

  getCollectionLineList() {
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = 'SELECT * FROM collection_line;';
          return from(CapacitorSQLite.query({database: this.dbName, statement, values: [] }));
        }
      })
    )
  }

}
