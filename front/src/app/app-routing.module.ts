import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/start/home/home.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignOutComponent } from './components/auth/sign-out/sign-out.component';
import { AboutComponent } from './components/start/about/about.component';
import { UsersComponent } from './components/users/company/users/users.component';

const routes: Routes = [

  {path:'', redirectTo:'home', pathMatch: "full"},
  {path: 'home', component: HomeComponent},
  {path: 'signIn', component: SignInComponent},
  {path: 'signOut', component: SignOutComponent},
  {path: 'about', component: AboutComponent},
  {path: 'user', component: UsersComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
