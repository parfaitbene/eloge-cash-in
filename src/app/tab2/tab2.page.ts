import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Collection } from '../models/collection.model';
import { CollectionService } from '../services/collection.service.';
import { popoverController } from '@ionic/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  collections: Collection[] = [];
  collectionsSubscription: Subscription;
  currentPopover = null;

  constructor(
      private collectionService: CollectionService,
      public actionSheetController: ActionSheetController
      // private popoverController: popoverController
    ) {}

  ngOnInit(){
    this.collectionsSubscription = this.collectionService.collectionsSubject.subscribe(
      (collections: Collection[]) => { 
        this.collections = collections; 
      }
    );
    this.collectionService.emitCollectionsList();
      
    this.initLiveSearch();
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

  async initActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'Actions',
        buttons: [{
          text: 'Vider',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Vider clicked');
          }
        }, {
          text: 'Importer',
          icon: 'cloud-upload',
          handler: () => {
            console.log('Importer clicked');
          }
        }, {
          text: 'Exporter',
          icon: 'cloud-download',
          handler: () => {
            console.log('Exporter clicked');
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        }]
      });
      await actionSheet.present();
  }

  initPopOver() {
    const buttons = document.querySelectorAll('ion-button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', handleButtonClick);
    }

    async function handleButtonClick(ev) {
      let popover = await popoverController.create({
        component: 'app-explore-container',
        event: ev,
        translucent: true
      });
      this.currentPopover = popover;
      return popover.present();
    }

    function dismissPopover() {
      if (this.currentPopover) {
        this.currentPopover.dismiss().then(() => { this.currentPopover = null; });
      }
    }

    customElements.define('app-explore-container', class ModalContent extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
          <ion-list>
            <ion-item button>Vider</ion-item>
            <ion-item button>Importer</ion-item>
            <ion-item lines="none" detail="false" button onClick="dismissPopover()">Exporter</ion-item>
          </ion-list>
        `;
      }
    });
    
  }
  

  ngOnDestroy(){
    this.collectionsSubscription.unsubscribe();
  }
}
