import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  datamessage: string = "";
  selectImage!: File;
  selectedImage: string | undefined | ArrayBuffer | null = '';
  id: any
  userName!: string
  imageUrl!: string;
  selectedVideo: string | null = null;
  isVideo: boolean = false;
  picture!: string
  changeHeaderName = 'Create a Post'
  constructor(private postService: PostService, private toastr: ToastrService, private userService: UserService,
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const token = localStorage.getItem('token');
    //  const loginWithGoogle = localStorage.getItem('loginWithGoogle');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
      const image = (decoded as any).image
      if (image) {
        this.picture = image
      }
    }
   
    else {
      console.error('Token not found in localStorage');
    }
    if (data) {
      this.datamessage = data.message;
         }
   


  }

  closePopup() {
    this.dialogRef.close();
  }
 
 
  onPost() {
    const formData = new FormData();
    formData.append('file', this.selectImage);
    formData.append('body', this.datamessage);
    const postMessage = {
      body: this.datamessage,
      // image: formData
    }
    if (!this.id) {
      this.postService.feedPost(formData).subscribe({
        next: (res) => {
          // Success case
          this.toastr.success("Message posted successfully");
          this.postService.update.next(true);
          this.dialogRef.close();
        },
        error: (error) => {
          // Error case
          console.error("An error occurred while posting the message:", error);
          this.toastr.error("Failed to post message. Please try again later.", error.message);
        }
      });

    } else {
      this.postService.editPost(this.id, postMessage).subscribe({
        next: res => {
          this.toastr.success("message updated successfully");
          this.postService.update.next(true)
          this.dialogRef.close();
        }, error: error => {
          console.error("An error occurred while updating the message:", error);
          this.toastr.error("Failed to update message. Please try again later.", error.message);
        }
      });
    }

  }
   
}
