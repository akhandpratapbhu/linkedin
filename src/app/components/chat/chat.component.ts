

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallingComponent } from '../calling/calling.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CallingComponent, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  messages: any = [];
  getAllmsgRoomById: any = []
  users: any;
  newMessage!: string;
  id!: string;
  selectedUser: any;
  currentUser: any;
  userName!: string;
  roomId!: string;

  constructor(private chatService: ChatService, private authService: AuthService, private route: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.id = (decoded as any).id;
      this.userName = (decoded as any).username;
    } else {
      console.error('Token not found in localStorage');
    }
    this.chatService.getMessage().subscribe((message) => {
      console.log(message);

      this.messages.push(message);

    });
    this.findAllUsers();

  }
  getImageUrl(userImg: any): string {
    if (userImg && userImg.startsWith('http')) {
      return userImg;
    }
    else if (!userImg.startsWith('http')) {
      return 'http://localhost:3000/api/feed/image/' + (userImg);;
    }
    return ''
  }
  findAllUsers() {
    this.authService.allUsers().subscribe((res) => {
      this.users = res;
      this.users.forEach((user: { image: string }) => {

        if (user.image) {
          user.image = this.getImageUrl(user.image)
        }
      })
    });
  }

  selectUserHandler(user: string) {
    const userName = user;
    this.selectedUser = this.users.find((user: { username: any }) => user.username === userName);
    console.log(" this.selectedUser", this.selectedUser);

    this.roomId = [this.id, this.selectedUser.id].sort().join('_');

    this.chatService.joinRoom(this.roomId);

    this.chatService.getAllmsgRoomById(this.roomId).subscribe(res => {
      console.log(res, typeof (res),);
      this.getAllmsgRoomById = res
      if (this.getAllmsgRoomById) {
        this.messages = this.getAllmsgRoomById
      }

console.log(  this.messages[1].sender.username ,this.userName);

    })


  }

  sendMessage(): void {
    const message = {
      senderId: this.id,
      recipientId: this.selectedUser.id,
      user: this.userName,
      content: this.newMessage
    };
    this.chatService.sendMessage(this.roomId, message);

    this.newMessage = '';
  }

  NavigateToCalling(id: string) {
    if (id) {
      this.route.navigate([`calling/${id}`]);
    }
  }

}


