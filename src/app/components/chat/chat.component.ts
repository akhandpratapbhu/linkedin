

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
    imports: [RouterOutlet,CommonModule,FormsModule,CallingComponent,MatIconModule ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
  })
export class ChatComponent implements OnInit {

  messages: any[] = [];
  users: any;
  newMessage!: string;
  id!: string;
  selectedUser: any;
  currentUser: any;
  private storageArray: any[] = [];
  userName!: string;
  roomId!: string;

  constructor(private chatService: ChatService, private authService: AuthService, private route: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.id = (decoded as any).id;
      this.userName = (decoded as any).username;
      console.log(this.id, this.userName);
    } else {
      console.error('Token not found in localStorage');
    }
    this.findAllUsers();
    this.chatService.getMessage().subscribe((message) => {
      console.log('message', message);
     // this.chatService.setStorage(message);
      this.messages.push(message);
    //  this.chatService.setStorage( this.messages);
      console.log(this.messages);
      this.storageArray = this.chatService.getStorage();
      console.log(this.storageArray);
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    console.log(this.storageArray,storeIndex);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push(message);
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [message]
      };
      this.storageArray.push(updateStorage);
    }
    this.chatService.setStorage(this.storageArray);
    });
  }

  findAllUsers() {
    this.authService.allUsers().subscribe((res) => {
      this.users = res;
    });
  }

  selectUserHandler(user: string) {
    const userName = user;
    this.selectedUser = this.users.find((user: { username: any }) => user.username === userName);
    console.log(this.selectedUser.id);

    this.roomId = [this.id, this.selectedUser.id].sort().join('_');
   
    this.chatService.joinRoom(this.roomId);

    this.messages = [];
    this.storageArray = this.chatService.getStorage();
    console.log("    this.storageArray",    this.storageArray);
    
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.messages = this.storageArray[storeIndex].chats;
      console.log('this.messages', this.messages);
    }
  }

  sendMessage(): void {
    const message = {
      senderId: this.id,
      recipientId: this.selectedUser.id,
      user: this.userName,
      content: this.newMessage
    };
    this.chatService.sendMessage(this.roomId, message);
   // this.messages.push(message);

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push(message);
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [message]
      };
      this.storageArray.push(updateStorage);
    }
  //  this.chatService.setStorage(this.storageArray);
    this.newMessage = '';
  }

  NavigateToCalling(id: string) {
    console.log(id);
    if (id) {
      this.route.navigate([`calling/${id}`]);
    }
  }

}


