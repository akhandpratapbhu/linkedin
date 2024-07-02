import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '../start-post/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ConnectionProfileComponent } from '../connection-profile/connection-profile.component';
import { PostService } from '../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { DeleteComfimationComponent } from '../shared/delete-comfimation/delete-comfimation.component';
@Component({
  selector: 'app-search-user-profile',
  standalone: true,
  imports: [HeaderComponent, MatIconModule, ModalComponent, CommonModule, ConnectionProfileComponent, RouterModule],
  templateUrl: './search-user-profile.component.html',
  styleUrl: './search-user-profile.component.css'
})
export class SearchUserProfileComponent {

  authorId!: string | null;
  username!: string | null;
  data = {}
  imagePath!: string
  friendRequestStatus!: any;
  getfriendRequestStatus!: any;
  token: string = '';
  userName: string = '';
  allPost: any = [];
  message: any;
  imageUrl: any;
  id: any;
  role: any;
  img: any
  constructor(private userService: UserService, private connectionProfile: ConnectionProfileService,
    private route: ActivatedRoute, private postService: PostService,
    public dialog: MatDialog, private toastr: ToastrService) {

  }
  async ngOnInit(): Promise<void> {

    this.route.paramMap.subscribe(params => {

      this.username = params.get('username'); // The 'id' here should match the parameter in your route definition
      if (this.username) {
  
         this.getSearchUserProfile(this.username)
  
      }
    });
   
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
      this.id = (decoded as any).id
      this.role = (decoded as any).role

    } else {
      console.error('Token not found in localStorage');
    }
  }

  getSearchUserProfile(username: string) {
    this.userService.getUserByUserName(username).subscribe(res => {
      if (Array.isArray(res)) {
        const users = res;
        
        this.authorId = users[0].id
        this.getConnectionUserProfile(this.authorId)
        this.getFriendRequestStatus(this.authorId)
        this.loadPosts(users[0].feedPosts)
      }

    })
  }
  getConnectionUserProfile(id: any) {
    this.connectionProfile.getConnectionUser(id).subscribe(res => {

      this.data = res
      if (this.data && Array.isArray(this.data) && this.data.length > 0) {
        const imagePath = this.data[0].image;
        this.userName = this.data[0].username
        // Access the image property from the first object

        if (imagePath !== null) {
          this.imagePath = this.userService.getfullImagePath(imagePath);
        } else {
          this.imagePath = this.userService.getDefaultfullImagePath();
        }
      }
    })
  }
  getFriendRequestStatus(id: any) {
    this.connectionProfile.getFriendRequestStatus(id).subscribe(res => {
      this.getfriendRequestStatus = res
      this.friendRequestStatus = this.getfriendRequestStatus.status
      // Access the image property from the first object

    })
  }
  addUser() {
    this.connectionProfile.addConnectionUser(this.authorId).subscribe(res => {
      this.getfriendRequestStatus = res
      this.friendRequestStatus = this.getfriendRequestStatus.status
    })
  }

  //========================================= load post

  loadPosts(post: any) {
    this.allPost = post;

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


  }
  loadfeedImage(image: string) {
    if (image) {
      return this.userService.getfullImagePath(image)
    }
    else {
      return this.imageUrl = this.userService.getDefaultfullImagePath()
    }

  }
  // Method to convert base64 string to image URL
  base64ToImageUrl(base64String: string) {

    return base64String;
  }


}
