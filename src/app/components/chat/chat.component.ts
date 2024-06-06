

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
    // if(  this.roomId ){
    //   const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    //   if (storeIndex > -1) {
    //     this.messages = this.storageArray[storeIndex].chats;
    //     console.log('this.messages', this.messages);
    //   }
    //   this.chatService.setStorage( this.messages);
    // }
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
    this.chatService.setStorage(this.storageArray);
    this.newMessage = '';
  }

  NavigateToCalling(id: string) {
    console.log(id);
    if (id) {
      this.route.navigate([`calling/${id}`]);
    }
  }
//   messages: any[] = [];
//   users:any=[]
//   newMessage!: string;
//   id!:string
//   selectedUser:any
//   currentUser:any
//   private storageArray:any []= [];
//   userName!:string;
  
//   constructor(private chatService: ChatService, private authService: AuthService,private route:Router) {}

//   ngOnInit() {
    
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decoded = jwtDecode(token);
//       this.id = (decoded as any).id;
      
//       this.userName = (decoded as any).username;
//       console.log( this.id, this.userName);
      
//     } else {
//       console.error('Token not found in localStorage');
//     }
//     this.findAllUsers();
//    return this.chatService.getMessage().subscribe((message) => {
//       console.log("message", message);
//       this.messages.push(message);
//       console.log( this.messages);
//       this.usermessage(message)
//       // if (this.id) {
//       //   console.log( "this.storageArray",this.id);
//       //             setTimeout(() => {
//       //               this.storageArray = this.chatService.getStorage();
//       //               console.log( "this.storageArray",this.storageArray);

//       //               const storeIndex = this.storageArray
//       //                 .findIndex((storage) => storage.senderId === this.id);
//       //               this.messages = this.storageArray[storeIndex]?.chats;
//       //             }, 500);
//       //           }
//     });
    
//   }
//   usermessage(message:any){
//     this.storageArray = this.chatService.getStorage();
//     console.log("  this.storageArray",message.content,  this.storageArray,message);
    
//     const storeIndex = this.storageArray
//       .findIndex((storage) => storage.recipientId === this.selectedUser.id && storage.senderId === this.id);
//       console.log("  this.storageArray",  this.storageArray,storeIndex);
    
//     if (storeIndex > -1) {
//       this.storageArray[storeIndex].chats.push({
     
//         content: message.content
//       });
//     } else {
//       const updateStorage = {
    
//         chats: [{
//           content: message
//         }]
//       };

//       this.storageArray.push(updateStorage);
//     }

//     this.chatService.setStorage(this.storageArray);
//     this.newMessage = '';
    
//   }
 
//   findAllUsers(){
//     this.authService.allUsers().subscribe(res=>{
//       this.users=res;
      
//     })
//   }
 
//   selectUserHandler(user:string){
// const userName=user
// this.selectedUser = this.users.find((user: { username: any; })=>user.username===userName);
// console.log(this.selectedUser.id);


//     this.messages = [];

//     this.storageArray = this.chatService.getStorage();
//     const storeIndex = this.storageArray.findIndex((storage) => storage.recipientId === this.selectedUser.id);
//     console.log(storeIndex,  this.storageArray[0],this.storageArray[0]?.recipientId, this.selectedUser.id,this.storageArray);
    
//     if (storeIndex > -1) {
//       this.messages = this.storageArray[storeIndex].chats;
//       console.log("this.messages", this.messages);
//     }
    

//  //   this.join(this.userName, this.id);
//   }

//   // join(username: string, id: string): void {
//   //   this.chatService.joinRoom({user: username, id: id});
//   // }
//   sendMessage(): void {
//     this.chatService.sendMessage({
//       recipientId: this.selectedUser.id,
//       senderId: this.id,
//       content: this.newMessage
//     });
   
//     this.storageArray = this.chatService.getStorage();
//     console.log("  this.storageArray",  this.storageArray);
    
//     const storeIndex = this.storageArray
//       .findIndex((storage) => storage.recipientId === this.selectedUser.id);
//       console.log("  this.storageArray",  this.storageArray,storeIndex);
    
//     if (storeIndex > -1) {
//       this.storageArray[storeIndex].chats.push({
//         senderId: this.id,
//         recipientId: this.selectedUser.id,
//         user: this.userName,
//         content: this.newMessage
//       });
//     } else {
//       const updateStorage = {
//         senderId: this.id,
//         recipientId: this.selectedUser.id,
//         chats: [{
//           user: this.userName,
//           content: this.newMessage
//         }]
//       };

//       this.storageArray.push(updateStorage);
//     }

//     this.chatService.setStorage(this.storageArray);
//     this.newMessage = '';
//   }
//   NavigateToCalling(id:string){
//     console.log(id);
//     if(id){
//       this.route.navigate([`calling/${id}`])    
//     }
   
//   }
}


