import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallingComponent } from '../calling/calling.component';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sendchatmessage',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CallingComponent, MatIconModule],
  templateUrl: './sendchatmessage.component.html',
  styleUrl: './sendchatmessage.component.css'
})
export class SendchatmessageComponent {

  
  messages: any = [];
  getAllmsgRoomById: any = []
  users: any;
  newMessage!: string;
  id!: string;
  selectedUser: any;
  currentUser: any;
  userName!: string;
  roomId!: string;
  selecteduserId!:string |null
  constructor(private chatService: ChatService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selecteduserId = params.get('userId'); // The 'id' here should match the parameter in your route definition
    console.log(this.selecteduserId);
    
    });
    if(this.selecteduserId){
     this.getSelectedUser(this.selecteduserId)
    }
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
 
  getSelectedUser(userId:string){
   this.userService.getUserById(userId).subscribe(res=>{
    this.selectUserHandler(res) 

   })
   
  }
  selectUserHandler(user: any) {
    this.selectedUser = user
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
      this.router.navigate([`calling/${id}`]);
    }
  }

}
