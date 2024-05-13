import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  imageUrl!:string;
  token: string = '';
  userName:string='';
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private postService: PostService
  ) { }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here
      if(imageUrl){
        this.imageUrl = imageUrl;
        console.log("this.imageUrl",this.imageUrl);
      } 
        else {
          this.imageUrl = this.userService.getDefaultfullImagePath()
        
      }

    });
  }


  SignOut() {

    console.log('Signing out...');
    localStorage.clear();
    this.toastr.success("user login out successfully...");
    this.router.navigate([""]);
  }
}
