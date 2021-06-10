import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { Subscription } from 'rxjs';
import { Tab3Page } from './tab3/tab3.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {


  constructor(private databaseService:DatabaseService,public modalController: ModalController) {
    console.log("IN APPCOMPONENT");

    let test = this.databaseService.init();

  }

  ngOnInit(){
    console.log("IN APPCOMPONENT OnInit");

  }

}
