import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  comments: any;
  newComment: string = '';

  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postService: PostService
  ) {

  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.postService.getComments(this.data.postId).subscribe(comments => {
      this.comments = comments; // Assign the fetched comments array to this.comments
      this.newComment = '';
    });
  }

  addComment(): void {

    const comment = {
      content: this.newComment
    }
    this.postService.commentOnPost(this.data.postId, comment).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }

  close(): void {
    this.dialogRef.close(this.comments);
  }
}
