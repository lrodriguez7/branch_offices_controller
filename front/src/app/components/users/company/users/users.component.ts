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
        console.log(this.updateUserModel);
      }
    }
  }

  register(){
    this.userService.register(this.userModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })
      this.getList();

    }, err => {
      Swal.fire({
        position: 'center',
          icon: 'error',
          title: err.error.message,
          showConfirmButton: false,
          timer: 1500

      })

    });
  }
  edit(){
    this.userService.edit(this.updateUserModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.updateUserModel = new User(
          response.data._id,
          response.data.idCompany,
          response.data.idPlace,
          response.data.nameUser,
          response.data.lastnameUser,
          response.data.nickUser,
          response.data.emailUser,
          "",
          ""
      );


      this.getList();
    }, err => {
      Swal.fire({
        position: 'center',
          icon: 'error',
          title: err.error.message,
          showConfirmButton: false,
          timer: 1500
      })
    });
  }

  deleter(){
    this.userService.deleter(this.updateUserModel._id).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.getList();
    }, errr => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: errr.error.message,
          showConfirmButton: false,
          timer: 1500
      })
    });
  }


  clean(){

    this.userModel = new User("","","","","","","","","");
    this.updateUserModel = new User("","","","","","","","","");
  }

}
