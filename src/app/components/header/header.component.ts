import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{


  ngOnInit(): void {
  }


  SignOut(): void {
    // Add your sign-out logic here
    console.log('Signing out...');
    // For example, you can redirect the user to a sign-out page
    // window.location.href = "signout.php";
  }
}
