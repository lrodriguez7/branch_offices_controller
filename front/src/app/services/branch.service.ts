import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';

import { GLOBAL } from './global.service';

import { Branch } from '../models/branch.module';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  public rute: String;
  public token: any = "";
  public auth: any;
  public headersVar = new HttpHeaders().set('Content-Type', 'application/json');
  public branchs: Branch[] | undefined;

  constructor(private http: HttpClient)
  { this.rute = GLOBAL.url}


  getBranchs(): Observable<any> {
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.get(this.rute + '/branches', { headers: headersToken })
  }
  search(id: String): Observable<any> {
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.get(this.rute + '/branch/search/' + id, { headers: headersToken })
  }

  register(branch: Branch): Observable<any> {
    let params = JSON.stringify(branch);
    let headersToken;

    if(localStorage.getItem("token")){
      this.token = localStorage.getItem('token')
      headersToken = this.headersVar.set('Authorization', this.token);
    }else{
      headersToken = this.headersVar;
    }
    return this.http.post(this.rute + '/branch/register', params, { headers: headersToken })
  }

  edit(branch: Branch): Observable<any> {
    let params = JSON.stringify(branch);
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.put(this.rute + '/branch/edit/'+branch._id, params, { headers: headersToken })
  }

  deleter(id: String): Observable<any> {
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.delete(this.rute + '/branch/delete/' + id, { headers: headersToken })
  }

  genPdf(){
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.post(this.rute + '/branches/pdf', {}, { headers: headersToken })
  }
}
