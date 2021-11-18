import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public user: any = {rolUser: "user"};

  constructor(
    private _router: Router
  ) {
    let auth;
    let convert = localStorage.getItem('auth')
    if(auth = localStorage.getItem('auth')){

      this.user = JSON.parse(String(convert));
    }
   }

  ngOnInit(): void {
    if(localStorage.getItem("token")){
      this._router.navigate(['/home'])
    }
  }

}
