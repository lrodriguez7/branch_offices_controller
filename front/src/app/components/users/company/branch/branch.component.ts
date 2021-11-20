import { Component, OnInit } from '@angular/core';

import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/models/branch.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  public tableBranch!: Array<Branch>;
  public branchModel: Branch = new Branch("","","","","",0);
  public updateBranchModel: Branch = new Branch("","","","","",0);

  constructor(
    public branchService: BranchService
  ) {
    this.getList();
  }

  ngOnInit(): void {

  }

  getList(){
    this.branchService.getBranchs().subscribe(
      response =>{
        var array: Branch[] = [];
        response.data.forEach((element: { _id: string; idCompany: string; idBranch: string; nameBranch: string; addressBranch: string; sale: Number; }) => {
          var tableUsers: Branch = new Branch(
            element._id,
            element.idCompany,
            element.idBranch,
            element.nameBranch,
            element.addressBranch,
            element.sale,
            );
        array.push(tableUsers);
        });
        this.tableBranch = array;
        console.log(this.tableBranch)
      },
      err =>{
        console.log(err);
      }
    )
  }

  get(id: String){
    var encontrado = false;
    for (let i = 0; i < this.tableBranch.length && encontrado == false; i++) {
      if(this.tableBranch[i]._id == id){
        this.updateBranchModel = this.tableBranch[i];
        console.log(this.updateBranchModel);
      }
    }
  }

  register(){
    this.branchService.register(this.branchModel).subscribe(response => {
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
    this.branchService.edit(this.updateBranchModel).subscribe(response => {
      Swal.fire({
        position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 1500
      })

      this.updateBranchModel = new Branch(
          response.data._id,
          response.data.idCompany,
          response.data.idBranch,
          response.data.nameBranch,
          response.data.addressBranch,
          response.data.sale,
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
    this.branchService.deleter(this.updateBranchModel._id).subscribe(response => {
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

    this.branchModel = new Branch("","","","","",0);
    this.updateBranchModel = new Branch("","","","","",0);
  }


}
