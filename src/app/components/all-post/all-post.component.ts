import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ModalComponent } from '../start-post/modal/modal.component';
import { DeleteComfimationComponent } from '../shared/delete-comfimation/delete-comfimation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule, ModalComponent],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',

})
export class AllPostComponent implements OnInit {
  token: string = '';
  userName: string = '';
  allPost: any = [];
  message: any;
  constructor(private postService: PostService, public dialog: MatDialog, private toastr: ToastrService) {

  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
  
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
      console.log(this.allPost);

    });
  }
  editPost(id: string) {
    
   this.postService.findPostById(id).subscribe((res:any) => {
      this.message = res[0]?.body; 
     this. openDialog(id);
    })

  }
  deletePost(id: string) {
    
    this.postService.deletePostById(id).subscribe({
      next:(res:any) => {
      console.log(res);
      this.toastr.success("message deleted successfully");
      this.postService.update.next(true)
    },error:error=>{
      this.toastr.error("message error occured",error.message);
    }})
  }
  deleteDialog(id: string) {
   
    this.dialog.open(DeleteComfimationComponent, {
      data:{id:id},
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {
     
      if(result){
       this.deletePost(id);
      }else{
        this.toastr.warning('Delete canceled');
      }
    });
  }
  openDialog(id: string) {
   
    console.log(this.message );
    this.dialog.open(ModalComponent, {
      data:{message:this.message,id:id},
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


