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
import { ConnectionProfileComponent } from '../connection-profile/connection-profile.component';
import { Router, RouterModule } from '@angular/router';
import { MessageComponent } from '../message/message.component';


@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [MatIconModule, ModalComponent, CommonModule, ConnectionProfileComponent, RouterModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',

})
export class AllPostComponent implements OnInit {
  url = 'http://jasonwatmore.com';
  token: string = '';
  userName: string = '';
  allPost: any = [];
  message: any;
  imageUrl: any;
  userImg!: {}
  id: any;
  role: any;
  img: any
  like: number = 0;
  likes: any;
  likesLength!: number;
  commentLength!: number
  liked: boolean = false; // Track if the user has liked the item
  constructor(private postService: PostService, private userService: UserService,
    public dialog: MatDialog, private toastr: ToastrService, private router: Router) {

  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userName = (decoded as any).username;
      this.id = (decoded as any).id
      this.role = (decoded as any).role

    } else {
      console.error('Token not found in localStorage');
    }
    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here

      if (imageUrl) {
        this.imageUrl = imageUrl;

      }
      else {
        this.imageUrl = this.userService.getDefaultfullImagePath()

      }

    });
    this.postService.update.subscribe({
      next: (data: boolean) => {
        this.loadPosts()
      }
    })
  }
  getImageUrl(userImg: any): string {

    if (userImg && userImg.startsWith('http')) {
      return userImg;
    }

    return 'http://localhost:3000/api/feed/image/' + (userImg || 'user.png');
  }
  loadPosts() {
    this.postService.getPost().subscribe(res => {
      this.allPost = res;

      this.allPost.forEach((post: { image: string; imageUrl: string; isImage: boolean; isVideo: boolean; user: { image: string } }) => {
        if (post.user.image) {
          post.user.image = this.getImageUrl(post.user.image)
        }
        else {
          post.user.image = 'http://localhost:3000/api/feed/image/' + 'user.png'
        }
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
  editPost(id: string) {

    this.postService.findPostById(id).subscribe((res: any) => {
      this.message = res[0]?.body;
      this.openDialog(id);
    })

  }
  deletePost(id: string) {

    this.postService.deletePostById(id).subscribe({
      next: (res: any) => {

        this.toastr.success("message deleted successfully");
        this.postService.update.next(true)
      }, error: error => {
        this.toastr.error("message error occured", error.message);
      }
    })
  }
  deleteDialog(id: string) {

    this.dialog.open(DeleteComfimationComponent, {
      data: { id: id },
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {

      if (result) {
        this.deletePost(id);
      } else {
        this.toastr.warning('Delete canceled');
      }
    });
  }
  openDialog(id: string) {


    this.dialog.open(ModalComponent, {
      data: { message: this.message, id: id, username: this.userName },
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  likeButton(postId: any) {
    console.log("postId", postId);
    this.postService.postLike(postId).subscribe(res => {
              this.getLike(postId)
    })
    // if (this.liked) {
    //   this.like = this.like - 1;
    // } else {
    //   this.like = this.like + 1;
    // }
    // this.liked = !this.liked;
  }
  getLike(postId: any) {
    this.postService.getLikes(postId).subscribe(likes => {
      this.likes = likes
      if (this.likes) {

        this.likesLength = this.likes.length
        const likes = {
          likes: this.likes.length
        }
        this.postService.editPost(postId, likes).subscribe(res => {
          console.log(res);
          this.loadPosts()
        })
      }

    })
  }
  // commentButton(username: any) {
  //   this.router.navigate([`message/${username}`])
  // }

  commentButton(post: any): void {
    console.log("commentButton", post);

    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      data: {
        postId: post.id,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result !== undefined) {
        post.comments = result;
        const comments = {
          comments: post.comments.length
        }
        this.postService.editPost(post.id, comments).subscribe(res => {
          console.log(res);
          this.loadPosts();
        })
         // Reload posts to update comments count
      }
    });
  }


}


