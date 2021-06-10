import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { DatabaseService } from "./database.service";
import { Plugins } from '@capacitor/core';
const { CapacitorSQLite,Storage} = Plugins;
import { Subject } from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import { ModalService } from "./modal-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    public user: User = new User ('','','','');
    userSubject = new Subject<User>();

    constructor(public databaseService: DatabaseService,public modalService: ModalService){
        // this.user.email = 'example@mail.cm';
        // this.user.firstName = 'Prénom';
        // this.user.name = 'Nom';
        // this.user.phone = '+2376112233';
        this.loadUser();
    }

    emitUser(){
      this.userSubject.next(this.user);
     }

    loadUser() {
      console.log("in LOAD USERLIST");
        this.databaseService.getUser().subscribe(
            res => {
              console.log('VALEURS DE LA BD CUSTOMER',res.values)
                res.values.forEach(c => {
                    let user = new User('','','','')
                    user.email = c.email
                    user.firstName = c.firstname;
                    user.name = c.name;
                    user.phone = c.phone;
                    user.id=c.id;
                    this.user = user;
                });
                this.emitUser()
                console.log('user first name1',this.user.firstName);
                console.log('user name1',this.user.name);
                console.log('user phone1',this.user.phone);
                console.log('this user email1',this.user.email);
            }
        );

    }


    async persistUser(user:User) {
      // Complete persist code here
      console.log("IN PERSIST USER");
      const statement = `INSERT INTO user (id,firstname, name, phone, email) VALUES ('${user.id}','${user.firstName}','${user.name}', '${user.phone}', '${user.email}');`;

      await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });

      console.log('Insertion.......');

      await Storage.set({ key:'first_db_setup', value: '1' });
      // this.databaseService.dbReady.next(true);
      this.loadUser();
      this.emitUser()
      this.modalService.dismissModal();



  }

  async updateUser(user:User) {
    // Complete persist code here
    console.log("IN UPDATE USER");
    console.log('user first name',user.firstName);
    console.log('user name',user.name);
    console.log('user phone',user.phone);
    console.log('this user email',this.user.email);
    //const statement = `UPDATE user SET firstname='${user.firstName}', name='${user.name}', phone='${user.phone}' WHERE email='${this.user.email}';`;
    const statement = `DELETE FROM user WHERE id='${this.user.id}';`;
    await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement });
    const statement2 = `INSERT INTO user (id,firstname, name, phone, email) VALUES ('${user.id}','${user.firstName}','${user.name}', '${user.phone}', '${this.user.email}');`;
    await CapacitorSQLite.execute({database: this.databaseService.getDBName() , statements: statement2 });
    console.log('Update.......');
    this.loadUser();
    this.emitUser()

}

    createUser(newUser: User) {
      console.log("IN USER CREATE");
      console.log('user first name',newUser.firstName);
      console.log('user name',newUser.name);
      console.log('user phone',newUser.phone);
      console.log('this user email',newUser.email);
        return new Promise(
            (resolve, reject) => {
                // this.collections.push(newCollection);
                newUser.id = uuidv4();
                this.persistUser(newUser);
                resolve(newUser);
            }
        );
    }
}
