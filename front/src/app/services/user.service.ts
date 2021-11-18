import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { GLOBAL } from './global.service';

import { User } from '../models/user.module';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public rute: String;
  public token: any;
  public auth: any;
  public headersVar = new HttpHeaders().set('Content-Type', 'application/json');
  public users: User[] | undefined;

  constructor(private http: HttpClient)
  { this.rute = GLOBAL.url}


  signUp(user: User): Observable<any>{
    let params = JSON.stringify(user);
    let headersToken

    if(localStorage.getItem("token")){

      var convert = localStorage.getItem("token");
    var token3 = JSON.parse(String(convert));
    headersToken = this.headersVar.set('Authorization', token3)
    }else{
      headersToken = this.headersVar;
    }
    return this.http.post(this.rute + '/user/register', params, {headers: headersToken})
  }

  signIn(user: User, getToken = null): Observable<any> {
    if (getToken != null) {
      getToken = getToken
    }
    let params = JSON.stringify(user);
    return this.http.post(this.rute + '/user/login', params, { headers: this.headersVar })
  }

  getToken(){
    var token2 = localStorage.getItem('token');
    if (token2 != 'undefined'){
      this.token = token2;
    }else{
      this.token = null;
    }
    return this.token;
  }

  getAuth(){

    var convert = localStorage.getItem("auth");
    var auth2 = JSON.parse(String(convert));
    if(auth2 != 'undefined'){
      this.auth = auth2
    }else{
      this.auth = null
    }
    return this.auth;
  }

  privateUrl(){
    return !!localStorage.getItem('token');
  }

  getUsers(): Observable<any> {
    let headersToken = this.headersVar.set('Authorization', this.getToken())
    return this.http.get(this.rute + '/users', { headers: headersToken })
  }
}
