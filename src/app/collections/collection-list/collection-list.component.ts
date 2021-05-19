import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ActionSheetController, NavController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Collection } from 'src/app/models/collection.model';
import { Customer } from 'src/app/models/customer.model';
import { CollectionService } from 'src/app/services/collection.service.';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  providers: [NavParams]
})
export class CollectionListComponent implements OnInit, OnDestroy {
  collections: Collection[] = [];
  collectionsSubscription: Subscription;

  constructor(
      private collectionService: CollectionService,
      public actionSheetController: ActionSheetController,
      private navController: NavController
    ) {}

  ngOnInit() {
    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => { 
        this.collections = collections.sort(); 
      }
    );
    this.collectionService.emitCollectionsList();

    this.initLiveSearch();
  }

  onDisplay(name: string) {
    let params: NavigationExtras = {queryParams: {'collection_name': name}};
    this.navController.navigateForward(['/tabs', 'collections', 'lines'], params);
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
    const wsname: string = 'Collecte-'+today.getFullYear().toString()+'-'+today.getMonth().toString()+'-'+today.getDate().toString();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.collections);
    XLSX.utils.book_append_sheet(wb, ws, wsname);
    XLSX.writeFile(wb, wsname+'.xlsx');
  }

  async initActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
      {
        text: 'Recettes',
        icon: 'cash',
        handler: () => {
          this.navController.navigateForward(['tabs','collections', 'lines']);
        }
      }, 
      {
        text: 'Vider',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.collectionService.setCollections([]);
        }
      }, 
      {

        text: 'Importer',
        icon: 'cloud-upload',
        handler: () => {
          this.navController.navigateForward(['tabs', 'collections', 'import']);
        }
      }, 
      // {
      //   text: 'Exporter',
      //   icon: 'cloud-download',
      //   handler: () => {
      //     this.onExport()
      //   }
      // }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.collectionsSubscription.unsubscribe();
  }
}
