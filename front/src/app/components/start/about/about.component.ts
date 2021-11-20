import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

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
      this._router.navigate(['/about'])
    }
  }

}
