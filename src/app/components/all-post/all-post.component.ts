import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',
  providers:[PostService]
  
})
export class AllPostComponent implements OnInit {
  token: string = '';
  userName:string='';
  allPost:any=[];
  constructor(private postService:PostService){

  }
  ngOnInit(): void {
    console.log("allllll");
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
    this.postService.getPost().subscribe(res=>{
      this.allPost=res;
      console.log("res",res);
      
    })
  }
}
