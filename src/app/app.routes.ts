import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
    {path:'',component:SignInComponent},
    {path:'register',component:SignUpComponent},
    {path:'dashboard',component:HomeComponent},
 
];
