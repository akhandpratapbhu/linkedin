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
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule, ModalComponent,CommonModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',

})
export class AllPostComponent implements OnInit {
  token: string = '';
  userName: string = '';
  allPost: any = [];
  message: any;
  imageUrl:any;
  id:any;
  role:any;
  constructor(private postService: PostService,private userService:UserService ,public dialog: MatDialog, private toastr: ToastrService) {

  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
      this.id=(decoded as any).id
      this.role=(decoded as any).role
      console.log(this.role);
      
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
      data:{message:this.message,id:id,username:this.userName},
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


