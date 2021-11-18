import { Component, OnInit } from '@angular/core';

import {  Router } from '@angular/router';

import { User } from 'src/app/models/user.module';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public token: any;
  public userModel: User;
  public auth: any;

  constructor(
    private _userService: UserService,
    private _router: Router

  ) {
    this.userModel= new User("","","","","","","","")
   }

  ngOnInit(): void {
    if(localStorage.getItem("token")){
      this._router.navigate(['/home'])
    }
  }

  getToken() {
    this._userService.signIn(this.userModel).subscribe(
      res => {
        this.token = res.token
        localStorage.setItem('token',this.token)
      },
      err => {
        console.log(<any>err)
      }
    )
  }

  signIn() {
    console.log(this.userModel)
    this._userService.signIn(this.userModel)
    .subscribe(
      res => {

        this.auth = res.data;
        console.log(this.auth);
        localStorage.setItem('auth', JSON.stringify(this.auth))
        this.getToken();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Bienvenido: ${this.auth.nickUser}`,
          showConfirmButton: false,
          timer: 2000
        }).then(()=>{
          this._router.navigate(['/home'])
        })
      },
      err => {
        if(err.status != 500){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.error.message,
            showConfirmButton: false,
            timer: 2500
          })
        } else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.error.message,
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    )
  }
}
