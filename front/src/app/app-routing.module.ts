import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/start/home/home.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';


const routes: Routes = [

  {path:'', redirectTo:'home', pathMatch: "full"},
  {path: 'home', component: HomeComponent},
  {path: 'signIn', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
