import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friend-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.css'
})
export class FriendRequestComponent {

  friendRequest: any=[]
  imagePath!: string
  constructor(private toastr: ToastrService, private connectionProfileService: ConnectionProfileService,
    public dialogRef: MatDialogRef<FriendRequestComponent>, private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (Array.isArray(data)) {
      this.friendRequest = data;
      //console.log(this.friendRequest[0]?.creator.image);

    }


    this.friendRequest.forEach((creator: { image: string }) => {
      if (creator.image) {
        creator.image = this.getImageUrl(creator.image)
      }
      else {
        creator.image = 'http://localhost:3000/api/feed/image/' + 'user.png'
      }
    // if (this.friendRequest?.creator?.image && this.friendRequest?.creator?.image.startsWith('https')) {
    //   this.imagePath = this.imagePath
    // }
    // else {
    //   this.loadprofileImage(this.imagePath)
    // }
  }
    )}

  closePopup() {
    this.dialogRef.close();
  }
  getImageUrl(userImg: any): string {

    if (userImg && userImg.startsWith('http')) {
      return userImg;
    }

    return 'http://localhost:3000/api/feed/image/' + (userImg || 'user.png');
  }




  loadprofileImage(imagePath: string) {

    if (imagePath) {
      this.imagePath = this.userService.getfullImagePath(imagePath)

    }
    else {
      this.imagePath = this.userService.getDefaultfullImagePath()

    }
  }
  respondToFriendRequest(id: number, statusResponse: string) {
    const status = {
      status: statusResponse
    };

    this.connectionProfileService.responseToFriendRequest(id, status).subscribe(res => {
      // Remove the responded friend request from the array
      this.friendRequest = this.friendRequest.filter((request: { id: number; }) => request.id !== id);
      // Optionally, show a toast notification
      this.toastr.success(`Friend request ${statusResponse}`);
      this.dialogRef.close(this.friendRequest);
    });
  }
}
