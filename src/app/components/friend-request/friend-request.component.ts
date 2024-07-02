import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-friend-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.css'
})
export class FriendRequestComponent {

  friendRequest: any
  constructor( private toastr: ToastrService, private connectionProfileService:ConnectionProfileService ,
    public dialogRef: MatDialogRef<FriendRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )  {
    // Assuming data is an array and you want to access the first element
if (Array.isArray(data)) {
  this.friendRequest = data;
}

  }

  closePopup() {
    this.dialogRef.close();
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
