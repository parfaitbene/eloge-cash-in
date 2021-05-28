import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private user: User = new User();

    constructor(){
        this.user.email = 'example@mail.cm';
        this.user.firstName = 'Prénom';
        this.user.name = 'Nom';
        this.user.phone = '+2376112233';
    }

    getUser(){
        return this.user;
    }
}
