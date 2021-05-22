import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CollectionLine } from 'src/app/models/collection-line.model';
import { Collection } from 'src/app/models/collection.model';
import { Customer } from 'src/app/models/customer.model';
import { CollectionService } from 'src/app/services/collection.service';
import { ModalService } from 'src/app/services/modal-service';

@Component({
  selector: 'app-collection-line-create',
  templateUrl: './collection-line-create.component.html',
  styleUrls: ['./collection-line-create.component.scss'],
  providers: [FormBuilder]
})
export class CollectionLineCreateComponent implements OnInit {
  @Input() collection: Collection;
  @Input() customer: Customer;
  myForm: FormGroup;  

  constructor( 
    private collectionService: CollectionService,  
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private navController: NavController,
    public modalService: ModalService,
    ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      amount: [, [Validators.required, Validators.min(1)]],
      date: (new Date()).toISOString(),
    });
  }

  onSave() {
    let formValue = this.myForm.value;
    let collectionLine = new CollectionLine(this.collection, this.customer, formValue.amount,  formValue.date);

    this.collectionService.createCollectionLine(collectionLine).then(
      (line: CollectionLine) => { 
        let params: NavigationExtras = {queryParams: {'collection_id': this.collection.id}};
        this.navController.navigateRoot(['/tabs', 'collections', 'lines'], params);
        this.modalController.dismiss().then(
          () => { this.modalController.dismiss(); }
        );
      }
    );
  }
  
  onCancel() {
    this.modalController.dismiss();
  }
}
