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

  friendRequest:any;
  constructor( private toastr: ToastrService, private connectionProfileService:ConnectionProfileService ,
    public dialogRef: MatDialogRef<FriendRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )  {
    // console.log("data",data,typeof(data));
    // this.friendRequest=data;
    // let x=this.friendRequest.creator
    // console.log("data",x);
    // Assuming data is an array and you want to access the first element
console.log("data", data, typeof(data));

// Ensure data is an array and has at least one element
if (Array.isArray(data) && data.length > 0) {
  // Access the first element in the array
  this.friendRequest = data;

  // Log the entire friendRequest object
  console.log("friendRequest", this.friendRequest);

  // Check if friendRequest has creator and it has a username property
  if (this.friendRequest.creator && this.friendRequest.creator.username) {
    let creatorUsername = this.friendRequest.creator.username;
    console.log("Creator's Username:", creatorUsername);
  }
}
  }

  closePopup() {
    this.dialogRef.close();
  }
  respondToFriendRequest(id:number,statusResponse:string){
    const status={
      status:statusResponse
    }
    console.log(status);
    
 this.connectionProfileService.responseToFriendRequest(id,status).subscribe(res=>{
  console.log(res);
  
 })
  }
}
