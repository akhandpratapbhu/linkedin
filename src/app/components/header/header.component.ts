import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { FriendRequestComponent } from '../friend-request/friend-request.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionProfileService } from '../../services/connection-profile.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,FriendRequestComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  imageUrl!:string;
  token: string = '';
  userName:string='';
  AllGetfriendRequest:any
  gettotalfriendRequest:number=0;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private postService: PostService,
    private connectionProfileService:ConnectionProfileService,
    public dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
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
    this.ReceiveFriendRequest();
  }
  ReceiveFriendRequest(){
    this.connectionProfileService.getFriendRequest().subscribe(res=>{
   
      this.AllGetfriendRequest=res
      console.log(this.AllGetfriendRequest);
        this.gettotalfriendRequest= this.AllGetfriendRequest.length;
        // Access the image property from the first object
        console.log("this.friendRequestStatus", this.gettotalfriendRequest);
    
      
    })
  }
  openDialogBox(): void { 
    this.dialog.open(FriendRequestComponent, {
    
     width: '450px',
     height: 'auto',
     data:this.AllGetfriendRequest,
   }).afterClosed().subscribe(result => {
     console.log('The dialog was closed');
   });
 }

  SignOut() {

    console.log('Signing out...');
    localStorage.clear();
    this.toastr.success("user login out successfully...");
    this.router.navigate([""]);
  }
}
