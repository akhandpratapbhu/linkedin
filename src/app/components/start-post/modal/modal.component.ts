import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { PostService } from '../../../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AllPostComponent } from '../../all-post/all-post.component';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,AllPostComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers:[AllPostComponent]
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  constructor(private postService: PostService, private toastr: ToastrService, private router: Router,private allPostComponent:AllPostComponent) {

  }
  closePopup() {
    this.isVisible = false;
  }
  onPost(message: string) {
    const postMessage = {
      body: message
    }
    console.log("form post", postMessage);
    this.postService.feedPost(postMessage).subscribe(res => {
      this.toastr.success("message post successfully");
     // this.router.navigate(['dashboard'])
     this.postService.update.next(true)
     this.isVisible = false;
    });
  }
}
