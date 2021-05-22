import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { CustomerListComponent } from 'src/app/customers/customer-list/customer-list.component';
import { CollectionLine } from 'src/app/models/collection-line.model';
import { Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-line-list',
  templateUrl: './collection-line-list.page.html',
  styleUrls: ['./collection-line-list.page.scss'],
  providers: [NavParams]
})
export class CollectionLineListPage implements OnDestroy{
  collection: Collection = null;
  collections: Collection[] = [];
  // collectionsLines: CollectionLine[] = [];
  collectionSubject = new Subject<Collection>();
  collectionSubscription: Subscription;

  constructor(
      private collectionService: CollectionService,
      public actionSheetController: ActionSheetController,
      public navParams: NavParams,
      private route: ActivatedRoute,
      public modalController: ModalController,
      public navController: NavController,
      public alertController: AlertController
    ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.collection = this.collectionService.getCollectionById(params['collection_id']);

      if(this.collection){
        this.collectionService.getCollectionLines(this.collection).then(
          (lines: CollectionLine[]) => {
            // this.collection.lines = lines;
            this.collection.lines = lines;
            this.collectionSubject.next(this.collection);
          });
      }
      else{
        this.navController.navigateForward(['/tabs', 'collections']);
      }
    });
  }

  ionViewDidEnter() {
    this.collectionSubscription = this.collectionSubject.subscribe(
      (collection: Collection) => { this.collection = collection; }
    );
    this.collectionSubject.next(this.collection);
    
    this.initLiveSearch();
  }

  initLiveSearch(){
    const searchbar = document.querySelector('ion-searchbar');
    try{
      searchbar.addEventListener('ionInput', this.handleInput);
    }catch(e){}
  }

  handleInput(event) {
    const items: any = Array.from(document.querySelector('ion-list#coll-lines').children);
    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  async onAddLineModal() {
    const modal = await this.modalController.create({
      component: CustomerListComponent,
      componentProps: {
        'collection': this.collection,
        'willAddLine': true
      }
    });

    return await modal.present();
  }

  onExport(){
    const wb = XLSX.utils.book_new();
    let today = new Date();
    const suffix: string = '-'+today.getFullYear().toString()+'-'+today.getMonth().toString()+'-'+today.getDate().toString();
    const wsname: string = 'Recettes-' + this.collection.name.trim() + suffix;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.formatExportLines());
    XLSX.utils.book_append_sheet(wb, ws, wsname);
    XLSX.writeFile(wb, wsname+'.xlsx');
  }

  formatExportLines() {
    let rows: any[] = [];

    this.collection.lines.forEach(line => {
      const row: any = {
        'prenom': line.customer.firstName,
        'nom': line.customer.name,
        'matricule': line.customer.accountNumber,
        'montant': line.amount,
        'date': line.date
      };

      rows.push(row);
    });

    return rows;
  }

  async initActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
      {
        text: 'Exporter',
        icon: 'cloud-download',
        handler: () => {
          this.onExport()
        }
      }, 
      {
        text: 'Vider',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          const alert = await this.alertController.create({
            header: 'Suppression recettes',
            subHeader: 'Voulez-vous vraiment supprimer toutes les recettes enregistrées pour '+ this.collection.name +'?',
            buttons: [
              {
                text: 'Non',
                role: 'cancel',
              }, 
              {
                text: 'Oui',
                handler: async () => {
                  await this.collectionService.deleteCollectionLines(this.collection).then(
                    (c: Collection) => { 
                      this.collectionSubject.next(c);
                    }
                  );
                }
              }
            ]
          });
          await alert.present();
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.collectionSubscription.unsubscribe();
  }
}
