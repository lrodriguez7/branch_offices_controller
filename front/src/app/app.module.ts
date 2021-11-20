import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { HomeComponent } from './components/start/home/home.component';
import { DefaultComponent } from './components/navbar/default/default.component';
import { SignOutComponent } from './components/auth/sign-out/sign-out.component';
import { NavCompanyComponent } from './components/navbar/nav-company/nav-company.component';
import { AboutComponent } from './components/start/about/about.component';
import { UsersComponent } from './components/users/company/users/users.component';
import { BranchComponent } from './components/users/company/branch/branch.component';
import { ProductsComponent } from './components/users/company/products/products.component';
import { ProductsBranchComponent } from './components/users/branch/products-branch/products-branch.component';
import { NavBranchComponent } from './components/navbar/nav-branch/nav-branch.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    DefaultComponent,
    SignOutComponent,
    NavCompanyComponent,
    AboutComponent,
    UsersComponent,
    BranchComponent,
    ProductsComponent,
    ProductsBranchComponent,
    NavBranchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
