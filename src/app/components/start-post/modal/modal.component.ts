import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { PostService } from '../../../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',

})
export class ModalComponent {
  datamessage: string = "";
  id: any
  userName!:string
  imageUrl!:string;
  changeHeaderName='Create a Post'
  constructor(private postService: PostService, private toastr: ToastrService,private userService: UserService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;

    } else {
      console.error('Token not found in localStorage');
    }
    if (data) {
      this.datamessage = data.message;
      this.id = data.id;
      this.userName=data.username
      this.changeHeaderName='Update a Post'
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
  closePopup() {
    this.dialogRef.close();
  }
  onPost() {
    const postMessage = {
      body: this.datamessage
    }
    console.log("form post", postMessage);
    if (!this.id) {
      this.postService.feedPost(postMessage).subscribe({
        next: (res) => {
          // Success case
          this.toastr.success("Message posted successfully");
          this.postService.update.next(true);
          this.dialogRef.close();
        },
        error: (error) => {
          // Error case
          console.error("An error occurred while posting the message:", error);
          this.toastr.error("Failed to post message. Please try again later.",error.message);
        }
      });
      
    } else {
      this.postService.editPost(this.id, postMessage).subscribe({
        next:res => {
        this.toastr.success("message updated successfully");
        this.postService.update.next(true)
        this.dialogRef.close();
      },error:error=>{
        console.error("An error occurred while updating the message:", error);
        this.toastr.error("Failed to update message. Please try again later.",error.message);
      }});
    }

  }
}
