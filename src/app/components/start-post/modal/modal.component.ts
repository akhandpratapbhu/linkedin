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
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const token = localStorage.getItem('token');
    //  const loginWithGoogle = localStorage.getItem('loginWithGoogle');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
      const image = (decoded as any).image
      if (image) {
        this.picture = this.getImageUrl(image)
      }
    }
   
    else {
      console.error('Token not found in localStorage');
    }
    if (data) {
      this.datamessage = data.message;
      this.id = data.id;
      this.userName = data.username
      this.changeHeaderName = 'Update a Post'
    }
    this.userService.getImageUrl().subscribe(url => {
      this.imageUrl = url;
      if (!this.imageUrl) {
        this.imagewhenrefreshPage()
      }

    });


  }
  getImageUrl(userImg: any): string {

    if (userImg && userImg.startsWith('http')) {
      return userImg;
    }

    return 'http://localhost:3000/api/feed/image/' + (userImg || 'user.png');
  }
  imagewhenrefreshPage() {
    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here
      if (imageUrl) {
        this.imageUrl = imageUrl;
      }
      else {
        this.imageUrl = this.userService.getDefaultfullImagePath()

      }

    });
  }
  closePopup() {
    this.dialogRef.close();
  }
 
  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.selectImage = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const mediaType = file.type.split('/')[0]; // Get the type of media selected (image or video)

      if (mediaType === 'image') {
        this.selectedImage = e.target.result;
        this.selectedVideo = null;
        this.isVideo = false;
      } else if (mediaType === 'video') {
        this.selectedVideo = e.target.result;
        this.selectedImage = null;
        this.isVideo = true;
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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
