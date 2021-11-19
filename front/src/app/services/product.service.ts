import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';

import { GLOBAL } from './global.service';

import { Product } from '../models/product.module';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public rute: String;
  public token: any = "";
  public auth: any;
  public headersVar = new HttpHeaders().set('Content-Type', 'application/json');
  public branchs: Product[] | undefined;

  constructor(private http: HttpClient)
  { this.rute = GLOBAL.url}


  getProducts(): Observable<any> {
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.get(this.rute + '/products', { headers: headersToken })
  }

  register(product: Product): Observable<any> {
    let params = JSON.stringify(product);
    let headersToken;

    if(localStorage.getItem("token")){
      this.token = localStorage.getItem('token')
      headersToken = this.headersVar.set('Authorization', this.token);
    }else{
      headersToken = this.headersVar;
    }
    return this.http.post(this.rute + '/product/register', params, { headers: headersToken })
  }

  edit(product: Product): Observable<any> {
    let params = JSON.stringify(product);
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.put(this.rute + '/product/edit/'+product._id, params, { headers: headersToken })
  }

  deleter(id: String): Observable<any> {
    this.token = localStorage.getItem('token')
    let headersToken = this.headersVar.set('Authorization', this.token)
    return this.http.delete(this.rute + '/product/delete/' + id, { headers: headersToken })
  }
}
