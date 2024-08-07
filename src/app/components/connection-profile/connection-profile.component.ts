import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-connection-profile',
  standalone: true,
  imports: [HeaderComponent,CommonModule,MatIconModule],
  templateUrl: './connection-profile.component.html',
  styleUrl: './connection-profile.component.css'
})
export class ConnectionProfileComponent {

  userId!: string | null;
  data = {}
  id!:string
  imagePath!: string
  userName!:string
  friendRequestStatus!:any;
  getfriendRequestStatus!:any;
  allPost:any
  imageUrl!: string;
  constructor(private userService: UserService, 
    private connectionProfile: ConnectionProfileService, private route: ActivatedRoute,private router:Router) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id'); // The 'id' here should match the parameter in your route definition
    });
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.id = (decoded as any).id

    } else {
      console.error('Token not found in localStorage');
    }
    this.getConnectionUserProfile(this.userId)
    this.getFriendRequestStatus(this.userId)
  }
  getConnectionUserProfile(id: any) {
    this.connectionProfile.getConnectionUser(id).subscribe(res => {

      this.data = res
      
      if (this.data && Array.isArray(this.data) && this.data.length > 0) {
        this.imagePath = this.data[0].image; 
       console.log(this.imagePath);
       
        this.userName=this.data[0].username
        this.allPost=this.data[0].feedPosts
        this.allPost.forEach((post: { image: string; imageUrl: string; isImage: boolean; isVideo: boolean; }) => {
          
          if (post.image) {
            // Check if the image URL ends with a common image extension
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const isImage = imageExtensions.some(ext => post.image.toLowerCase().endsWith(ext));
  
            // Check if the image URL ends with a common video extension
            const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
            const isVideo = videoExtensions.some(ext => post.image.toLowerCase().endsWith(ext));
  
            if (isImage) {
              // It's an image
  
              post.isImage = true;
              post.isVideo = false;
              // You can then proceed with loading/displaying the image
            } else if (isVideo) {
              // It's a video
  
              post.isImage = false;
              post.isVideo = true;
              // You can then proceed with loading/displaying the video
            } else {
              // It's neither an image nor a video
  
              post.isImage = false;
              post.isVideo = false;
              // Handle accordingly
            }
  
            post.imageUrl = this.loadfeedImage(post.image);
  
          }
        });
        // Access the image property from the first object

        if (this.imagePath &&  this.imagePath.startsWith('http')) {
          this.imagePath = this.imagePath
        }
       else{
        this.loadprofileImage( this.imagePath)
       }
      }
    })
  }
  loadprofileImage(imagePath:string){
    
    if (imagePath) {
      this.imagePath = this.userService.getfullImagePath(imagePath)

    }
    else {
    this.imagePath = this.userService.getDefaultfullImagePath()

    }
  }
  loadfeedImage(image: string) {
    
    if (image) {
      return this.userService.getfullImagePath(image)
    }
    else {
      return this.imageUrl = this.userService.getDefaultfullImagePath()
    }

  }
  getFriendRequestStatus(id:any){
    this.connectionProfile.getFriendRequestStatus(id).subscribe(res=>{
      this.getfriendRequestStatus=res
        this.friendRequestStatus= this.getfriendRequestStatus.status
        // Access the image property from the first object
        
    })
  }
  addUser(){
    this.connectionProfile.addConnectionUser(this.userId).subscribe(res=>{
      this.getfriendRequestStatus=res
        this.friendRequestStatus= this.getfriendRequestStatus.status
    })
  }
  chatwithSelectedUser(){
    if(this.id!=this.userId){
      this.router.navigate([`chat/${this.userId}`])
    }else{
      console.log("do not message with yourself..please send message another user");
      
    }
  }
}
