import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',
  providers: []

})
export class AllPostComponent implements OnInit {
  token: string = '';
  userName: string = '';
  allPost: any = [];
  constructor(private postService: PostService, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
    // this.loadPosts();
    this.postService.update.subscribe({
      next: (data: boolean) => {
        console.log(data)

        this.loadPosts()
      }
    })
  }
  loadPosts(): void {
    this.postService.getPost().subscribe(res => {
      this.allPost = res;
      this.cdr.detectChanges(); // Trigger change detection
      console.log(this.allPost);

    });
  }
  editPost(id: string) {
    console.log("edit", id);
    this.postService.findPostById(id).subscribe(res => {
      console.log("res", res);

    })

  }
  deletePost(id: string) {
    console.log("delete", id);

  }
}
