import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CallingComponent } from '../calling/calling.component';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services/chat.service';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,CallingComponent,MatIconModule ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  messages: any[] = [];
  users: any;
  newMessage!: string;
  id!: string;
  selectedUser: any;
  currentUser: any;
  private storageArray: any[] = [];
  userName!: string;
  roomId!: string;
  authorId!: string | null;
  img!:string;
  constructor(private chatService: ChatService, private userService: UserService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
     
      this.authorId = params.get('id'); // The 'id' here should match the parameter in your route definition
      console.log('Author ID:', this.authorId);
      if(this.authorId){
        this.findUser(this.authorId);
      }
   
    });
    const token = localStorage.getItem('token');                                                                                 
    if (token) {
      const decoded = jwtDecode(token);
      this.id = (decoded as any).id;
      this.userName = (decoded as any).username;
      console.log(this.id, this.userName);
    } else {
      console.error('Token not found in localStorage');
    }
   
    
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
    this.roomId = [this.id, this.users[0]?.id].sort().join('_');
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

  findUser(username:string) {
    this.userService.getUserByUserName(username).subscribe((res) => {
      this.users = res;
      this.img=this.users[0].image
      console.log("this.users",this.users[0].id,this.users);
      this. selectUserHandler(this.users[0].id)
    });
  }

  selectUserHandler(selectedUserid:string) {
    const userName = this.authorId;
    console.log("userName",userName);
    
    this.selectedUser =userName
    // this.users.find((user: { username: any }) => user.username === userName);
   

    this.roomId = [this.id, selectedUserid].sort().join('_');
    console.log(this.selectedUser, this.roomId );
    this.chatService.joinRoom(this.roomId);

    this.messages = [];
    this.storageArray = this.chatService.getStorage();
   
    
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    console.log("    this.storageArray", storeIndex, this.roomId,  this.storageArray);
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
      this.router.navigate([`calling/${id}`]);
    }
  }

}
