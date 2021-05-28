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
    console.log("IN APPCOMPONENT");
    let test = this.databaseService.init();
    
    // this.databaseService.init().then(
    //   (test: boolean) => {
    //     if(test){
    //       // var result:any = this.databaseService.getCollectionList();
    //       this.databaseService.getCollectionList().subscribe(
    //         (res) => {
    //           console.log("IN COMPONENT IF",res.values);
    //           console.log("I+++++++++++ ",res.values.length);
    //           this.collectionService.setCollections(res.values);

    //         }
    //       );
    //     }
    //   }
    // );

  }


}
