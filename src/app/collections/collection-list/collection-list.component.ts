import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ActionSheetController, AlertController, NavController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service';
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
      private navController: NavController,
      public alertController: AlertController
    ) {}

  ngOnInit() {
    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => { 
        this.collections = collections.sort(); 
      }
    );
    this.collectionService.emitCollectionsList();
  }
  
  ionViewDidEnter() {
    this.initLiveSearch();
  }

  onDisplay(id: string) {
    let params: NavigationExtras = {queryParams: {'collection_id': id}};
    this.navController.navigateForward(['/tabs', 'collections', 'lines'], params);
  }

  initLiveSearch(){
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }

  handleInput(event) {
    const items: any = Array.from(document.querySelector('ion-list#collections').children);
    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  async onNew() {
    const alert = await this.alertController.create({
      header: 'Titre',
      subHeader: 'Débuter une nouvelle collecte',
      inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Ex: Collecte de Lundi'
          },
        ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        }, 
        {
          text: 'Enregistrer',
          handler: () => {
            alert.dismiss();
            alert.onDidDismiss().then(
              (datas: any) => {
                if(datas.data.values['name'])
                  this.collectionService.createCollection(new Collection(datas.data.values['name']))
            });
          }
        }
      ]
    });
  
    await alert.present();
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
        text: 'Vider',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          const alert = await this.alertController.create({
            header: 'Suppression collectes',
            subHeader: 'Voulez-vous vraiment supprimer toutes les collectes? Cette action supprimera également toutes les recettes enregistrées jusqu\ici.',
            buttons: [
              {
                text: 'Non',
                role: 'cancel',
              }, 
              {
                text: 'Oui',
                handler: () => {
                  this.collectionService.deleteAllCollections();
                }
              }
            ]
          });
          await alert.present();
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
      }
    ]
    });
    await actionSheet.present();
  }

  ngOnDestroy() {
    this.collectionsSubscription.unsubscribe();
  }
}
