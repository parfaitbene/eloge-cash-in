import { Component, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modal = null;
  private datas: {};
  modalSubject: Subject<any> = new Subject<any>();

  constructor(public modalController: ModalController) {}

  async presentModal(options: any) {
    const modal = await this.modalController.create(options);

    this.modal = modal;
    this.emitModal();
    return await modal.present();
  }

  
  dismissModal(datas: {} = {}) {
    this.datas = datas;
    
    if (this.modal) {
      this.modal.dismiss(datas).then(() => { 
        this.modal = null; 
        this.emitModal();
      });
    }
  }

  getModal() { return this.modal; }

  getDatas() { 
    let datas = this.datas;
    this.clearDatas(); //Modal is share with many pages and components

    return datas;
  }

  clearDatas() {
    this.datas = {};
  }

  emitModal() {
    this.modalSubject.next(this.modal);    
  }
}
