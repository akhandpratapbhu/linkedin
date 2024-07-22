import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-start-post',
  standalone: true,
  imports: [ModalComponent, MatIconModule],
  templateUrl: './start-post.component.html',
  styleUrl: './start-post.component.css'
})
export class StartPostComponent {
  imageUrl!: string;
  picture!: string;
  constructor(public dialog: MatDialog, private postService: PostService, private userService: UserService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const image = (decoded as any).image
      if (image) {
        this.picture = this.getImageUrl(image)
        console.log(this.picture);
        
      }

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
  openDialogBox(): void {
    this.dialog.open(ModalComponent, {
      width: '350px',
      height: '250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
