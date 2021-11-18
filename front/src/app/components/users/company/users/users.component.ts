import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public tableUsers!: Array<User>;
  public userModel: User = new User("","","","","","","","","");
  public updateUserModel: User = new User("","","","","","","","","");

  constructor(
    public userService: UserService
  ) {
    this.getList();
  }

  ngOnInit(): void {

  }

  getList(){
    this.userService.getUsers().subscribe(
      response =>{
        var array: User[] = [];
        response.data.forEach((element: { _id: string; idCompany: string; idPlace: string; nameUser: string; lastnameUser: string; nickUser: string; emailUser: string; }) => {
          var tableUsers: User = new User(
            element._id,
            element.idCompany,
            element.idPlace,
            element.nameUser,
            element.lastnameUser,
            element.nickUser,
            element.emailUser,
            "",
            ""
            );
        array.push(tableUsers);
        });
        this.tableUsers = array;
        console.log(this.tableUsers)
      },
      err =>{
        console.log(err);
      }
    )
  }

  get(id: String){
    var encontrado = false;
    for (let i = 0; i < this.tableUsers.length && encontrado == false; i++) {
      if(this.tableUsers[i]._id == id){
        this.updateUserModel = this.tableUsers[i];
      }
    }
  }

  registrar(){
    this.userService.register(this.userModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.getList();
    }, error => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: error.error.message,
          showConfirmButton: false,
          timer: 1500
      })
    });
  }



  limpiar(){

    this.userModel = new User("","","","","","","","","");
    this.updateUserModel = new User("","","","","","","","","");
  }

}
