import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  @Input() firstConnection: boolean = false;
  myForm: FormGroup;
  user: User = new User('','','','');
  userSubscription: Subscription;

  constructor(private userService: UserService,private formBuilder: FormBuilder) {

  }



  ngOnInit() {

    this.userSubscription = this.userService.userSubject.subscribe(
      (user:User) => {
        this.user=user;
        console.log('in user subscription',this.user.email);
      }
      );
      this.userService.emitUser();

      this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      firstName: this.user.firstName,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
    });
  }

  ionViewWillEnter(){
    this.initForm();

  }

  onSave(){
    let formValue = this.myForm.value;
    console.log('in onSave***************',formValue);
    var newUser=new User('','','','');
    newUser.firstName= formValue['firstName']
    newUser.name= formValue['name']
    newUser.email= formValue['email']
    newUser.phone= formValue['phone']

    if(this.firstConnection){
      console.log('IN CREATE');
      this.userService.createUser(newUser);

    }else{
      console.log('IN UPDATE');
      this.userService.updateUser(newUser);
    }


  }

  ngOnDestroy() {
      this.userSubscription.unsubscribe();
    }

}
