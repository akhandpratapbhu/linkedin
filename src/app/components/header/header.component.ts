import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  token: string = '';
  userName:string='';
  constructor(
    private router: Router,
    private toastr: ToastrService,

  ) { }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
  }


  SignOut(): void {

    console.log('Signing out...');
    localStorage.clear();
    this.toastr.success("user login out successfully...");
    this.router.navigate(["dashboard"]);
  }
}
