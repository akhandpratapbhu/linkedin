import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import {MatIconModule} from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-start-post',
  standalone: true,
  imports: [ModalComponent,MatIconModule],
  templateUrl: './start-post.component.html',
  styleUrl: './start-post.component.css'
})
export class StartPostComponent {
  imageUrl!:string;
  constructor(public dialog: MatDialog,private postService:PostService,private userService: UserService) {
    this.postService.imageUrl.subscribe(imageUrl => {
      // Handle the emitted imageUrl here
      if(imageUrl){
        this.imageUrl = imageUrl;
        // console.log("this.imageUrl",imageUrl);
      } 
        else {
          this.imageUrl = this.userService.getDefaultfullImagePath()
        
      }

    });
  }
  openDialogBox(): void { 
     this.dialog.open(ModalComponent, {
      width: '350px',
      height:'250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
