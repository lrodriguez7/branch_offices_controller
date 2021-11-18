import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");

    this._router.navigate(["/home"]);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `sesion cerrada, hasta pronto`,
      showConfirmButton: false,
      timer: 2000
    })
  }
}
