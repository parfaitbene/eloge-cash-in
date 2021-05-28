import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component } from '@angular/core';
import { CollectionService } from './services/collection.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private databaseService:DatabaseService,private collectionService:CollectionService) {
    console.log("IN APPCOMPONENT")
    if(this.databaseService.init()){
      var result:any = this.databaseService.getCollectionList();
      console.log("IN COMPONENT IF",result);
      this.collectionService.setCollections(result.value);
    }

  }


}
