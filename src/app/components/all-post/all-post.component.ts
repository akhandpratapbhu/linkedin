import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',
  providers:[PostService]
  
})
export class AllPostComponent implements OnInit {

  allPost:any=[];
  constructor(private postService:PostService){

  }
  ngOnInit(): void {
    console.log("allllll");
    
    this.postService.getPost().subscribe(res=>{
      this.allPost=res;
      console.log("res",res);
      
    })
  }
}
