import { Component, OnInit } from '@angular/core';

import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public tableProduct!: Array<Product>;
  public productModel: Product = new Product("","","","","",0,0);
  public updateProductModel: Product = new Product("","","","","",0,0)

  constructor(
    public productService: ProductService
  ) {
    this.getList();
  }

  ngOnInit(): void {

  }

  getList(){
    this.productService.getProducts().subscribe(
      response =>{
        var array: Product[] = [];
        response.data.forEach((element: { _id: string; idCompany: string; idDestiny: string; nameProduct: string; nameProvedor: string; stock: Number; sale: Number; }) => {
          var tableUsers: Product = new Product(
            element._id,
            element.idCompany,
            element.idDestiny,
            element.nameProduct,
            element.nameProvedor,
            element.stock,
            element.sale,
            );
        array.push(tableUsers);
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
    this.productService.register(this.productModel).subscribe(response => {
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
    this.productService.edit(this.updateProductModel).subscribe(response => {
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
    this.productService.deleter(this.updateProductModel._id).subscribe(response => {
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

    this.productModel = new Product("","","","","",0,0)
    this.updateProductModel = new Product("","","","","",0,0)
  }

}
