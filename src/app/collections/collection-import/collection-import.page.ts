import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Collection } from 'src/app/models/collection.model';
import { CollectionService } from 'src/app/services/collection.service.';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-import',
  templateUrl: './collection-import.page.html',
  styleUrls: ['./collection-import.page.scss'],
})
export class CollectionImportPage implements OnInit {
  fileToUpload: any;
  collections: Collection[] = [];
  count: number = 0;

  constructor(private customerService: CollectionService, private navCtrl: NavController) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    if(event.target.files.length){
      this.fileToUpload = event.target.files[0];
      this.onImport(event);
    }
  }

  onImport(evt) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let datas: any[] = (XLSX.utils.sheet_to_json(ws));
      this.count = datas.length;
      this.parseDatas(datas)
    };
    reader.readAsBinaryString(target.files[0]);
  }

  parseDatas(datas: any[]) {
    datas.forEach(row => {
      let collection = new Collection(row.name);
      this.collections.push(collection);
    });
  }

  onSave(){
    this.customerService.setCollections(this.collections);
    this.navCtrl.navigateRoot('/tabs/collections');
  }
}
