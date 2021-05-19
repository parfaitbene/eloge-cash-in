import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, NavController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionLine } from 'src/app/models/collection-line.model';
import { Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service.';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-line-list',
  templateUrl: './collection-line-list.page.html',
  styleUrls: ['./collection-line-list.page.scss'],
  providers: [NavParams]
})
export class CollectionLineListPage implements OnInit, OnDestroy {
  collection: Collection = null;
  collections: Collection[] = [];
  collectionsLines: CollectionLine[] = [];
  collectionsLinesSubscription: Subscription;
  collectionsSubscription: Subscription;

  constructor(
      private collectionService: CollectionService,
      public actionSheetController: ActionSheetController,
      private navController: NavController,
      public navParams: NavParams,
      private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.collectionsLinesSubscription = this.collectionService.collectionsLinesSubject.subscribe(
      (collectionsLines: CollectionLine[]) => { 
        this.collectionsLines = collectionsLines.sort(); 
        console.log(this.collectionsLines);
      }
    );
    this.collectionService.emitCollectionsLinesList();

    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => { 
        this.collections = collections.sort(); 
      }
    );
    this.collectionService.emitCollectionsList();

    this.initLiveSearch();
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.collection = this.collectionService.getCollectionByName(params['collection_name']);
      this.collection = this.collection? this.collection : new Collection(params['collection_name']);
    });
  }

  initLiveSearch(){
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }

  handleInput(event) {
    const items: any = Array.from(document.querySelector('ion-list').children);
    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  onExport(){
    const wb = XLSX.utils.book_new();
    let today = new Date();
    const wsname: string = 'Recettes-'+today.getFullYear().toString()+'-'+today.getMonth().toString()+'-'+today.getDate().toString();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getExportLines());
    XLSX.utils.book_append_sheet(wb, ws, wsname);
    XLSX.writeFile(wb, wsname+'.xlsx');
  }

  getExportLines() {
    let rows: any[] = [];

    this.collectionsLines.forEach(line => {
      const row: any = {
        'prenom': line.customer.firstName,
        'nom': line.customer.name,
        'compte': line.customer.accountNumber,
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
      buttons: [{
        text: 'Vider',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.collectionService.setCollectionsLines([]);
        }
      }, {

        text: 'Importer',
        icon: 'cloud-upload',
        handler: () => {
          let params: NavigationExtras = {queryParams: {'collection_name': this.collection.name}};
          this.navController.navigateForward(['tabs', 'collections', 'lines', 'import'], params);
        }
      }, {
        text: 'Exporter',
        icon: 'cloud-download',
        handler: () => {
          this.onExport()
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.collectionsLinesSubscription.unsubscribe();
    this.collectionsSubscription.unsubscribe();
  }
}
