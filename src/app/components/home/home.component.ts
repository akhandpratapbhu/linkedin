import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { StartPostComponent } from '../start-post/start-post.component';
import { AdvertisingComponent } from '../advertising/advertising.component';
import { AllPostComponent } from '../all-post/all-post.component';
import { jwtDecode } from "jwt-decode";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StartPostComponent, HeaderComponent, AdvertisingComponent, AllPostComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  token: string = '';
  userName:string='';
  role:string='';
  constructor() {
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.role = (decoded as any).role;
      this.userName = (decoded as any).username;   
      console.log(this.role,typeof(this.role),this.userName,typeof(this.userName));
      
    } else {
      console.error('Token not found in localStorage');
    }
  }
}
