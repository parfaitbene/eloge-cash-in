import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user: User = new User();

  constructor(private userService: UserService) {}

  ionViewWillEnter(){
    this.user = this.userService.getUser();
  }

  onSave(){}
}
