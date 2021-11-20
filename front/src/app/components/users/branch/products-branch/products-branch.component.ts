import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { BranchService } from 'src/app/services/branch.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-branch',
  templateUrl: './products-branch.component.html',
  styleUrls: ['./products-branch.component.css']
})
export class ProductsBranchComponent implements OnInit {

  public user: any = {rolUser: "user"};
  public tableProduct!: Array<Product>;
  public productModel: Product = new Product("","","","","",0,0);
  public updateProductModel: Product = new Product("","","","","",0,0)
  public parametros: any;

  modelProduct:any={
    idBranch:null,
    idCompany:null,
    nameProduct:null,
    nameProvedor:null,
    stock:null,
    sale:null,
    idDestiny:null
  }


  constructor(
    private _router: Router,
    public productService: ProductService,
    public branchService: BranchService,
    private router: ActivatedRoute

  ) {
    let auth;

    let convert = localStorage.getItem('auth')
    if(auth = localStorage.getItem('auth')){

      this.user = JSON.parse(String(convert));
    }
    this.getList();
   }

  ngOnInit(): void {

    var idBranch = this.router.snapshot.params['idBranch'];
    this.branchService.search(idBranch).subscribe(res=>{
      var branchFound = res['data']
      this.modelProduct.idDestiny = branchFound.idBranch;
      this.modelProduct.idCompany = branchFound.idCompany;
      this.productModel.idDestiny = branchFound.idBranch;
      this.productModel.idCompany = branchFound.idCompany;
      this.productService.setProductsBranch(this.modelProduct).subscribe(res => {
        var array: Product[] = [];
        res.data.forEach((element: { _id: string; idCompany: string; idDestiny: string; nameProduct: string; nameProvedor: string; stock: Number; sale: Number; }) => {
          var tableProduct: Product = new Product(
            element._id,
            element.idCompany,
            element.idDestiny,
            element.nameProduct,
            element.nameProvedor,
            element.stock,
            element.sale,
            );
        array.push(tableProduct);
        });
        this.tableProduct = array;

        console.log(this.productModel.idDestiny)

      }, error => {
        console.log(error);
      })
    })
    console.log(idBranch)
  }

  getList(){
    this.productService.getProductsBranch().subscribe(
      response =>{
        var array: Product[] = [];
        response.data.forEach((element: { _id: string; idCompany: string; idDestiny: string; nameProduct: string; nameProvedor: string; stock: Number; sale: Number; }) => {
          var tableProduct: Product = new Product(
            element._id,
            element.idCompany,
            element.idDestiny,
            element.nameProduct,
            element.nameProvedor,
            element.stock,
            element.sale,
            );
        array.push(tableProduct);
        });
        this.tableProduct = array;
        console.log(this.tableProduct)
      },
      err =>{
        console.log(err);
      }
    )
  }


  get(id: String){
    var encontrado = false;
    for (let i = 0; i < this.tableProduct.length && encontrado == false; i++) {
      if(this.tableProduct[i]._id == id){
        this.updateProductModel = this.tableProduct[i];
        console.log(this.updateProductModel);
      }
    }
  }



  register(){
    this.productService.add(this.productModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.ngOnInit();

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
    this.productService.change(this.updateProductModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.updateProductModel = new Product(
        response._id,
        response.idCompany,
        response.idDestiny,
        response.nameProduct,
        response.nameProvedor,
        response.stock,
        response.sale,
      );


      this.ngOnInit();
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
    this.productService.remove(this.updateProductModel._id).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })
      this.tableProduct = [];


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

    this.productModel = new Product("","","","","",0,0)
    this.updateProductModel = new Product("","","","","",0,0)
  }

  sale(){
    this.productService.sale(this.updateProductModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.updateProductModel = new Product(
        response._id,
        response.idCompany,
        response.idDestiny,
        response.nameProduct,
        response.nameProvedor,
        response.stock,
        response.sale,
      );

      this.getList();
      this.ngOnInit();
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


}
