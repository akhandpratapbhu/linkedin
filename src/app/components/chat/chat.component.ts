// import { Component, ViewChild } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common'; 
// import { FormsModule } from '@angular/forms';
// import { ChatService } from '../../services/chat.service';

// @Component({
//   selector: 'app-chat',
//   standalone: true,
//   imports: [RouterOutlet,CommonModule,FormsModule ],
//   templateUrl: './chat.component.html',
//   styleUrl: './chat.component.css'
// })
// export class ChatComponent {

//   title = 'chatApp';
//   @ViewChild('popup', {static: false}) popup: any;

//   public roomId!:string;
//   public messageText!: string;
//   public messageArray: { user: string, message: string }[] = [];
//   private storageArray:any []= [];

//   public showScreen = false;
//   public phone!: string;
//    currentUser:any;
//    selectedUser:any;

//   public userList = [
//     {
//       id: 1,
//       name: 'Akhand',
//       phone: '9140903852',
//       image: '../../../assets/img/user.png',
//         roomId: {
//         2: 'room-1',
//         3: 'room-2',
//         4: 'room-3'
//       }
//     },
//     {
//       id: 2,
//       name: 'deepu',
//       phone: '7393921912',
//       image: '../../../assets/img/user.png',
//       roomId: {
//         1: 'room-1',
//         3: 'room-4',
//         4: 'room-5'
//       }
//     },
//     {
//       id: 3,
//       name: 'sanjay',
//       phone: '9140359206',
//       image: '../../../assets/img/user.png',
//       roomId: {
//         1: 'room-2',
//         2: 'room-4',
//         4: 'room-6'
//       }
//     },
//     {
//       id: 4,
//       name: 'bharti',
//       phone: '9876556789',
//       image: '../../../assets/img/user.png',
//       roomId: {
//         1: 'room-3',
//         2: 'room-5',
//         3: 'room-6'
//       }
//     }
//   ];

//   constructor(
//   //  private modalService: NgbModal,
//     private chatService: ChatService
//   ) {
//   }

//   ngOnInit(): void {
//     this.chatService.getMessage()
//       .subscribe((data: { user: string, room: string, message: string }) => {
//         // this.messageArray.push(data);
//         if (this.roomId) {
//           setTimeout(() => {
//             this.storageArray = this.chatService.getStorage();
//             const storeIndex = this.storageArray
//               .findIndex((storage) => storage.roomId === this.roomId);
//             this.messageArray = this.storageArray[storeIndex].chats;
//           }, 500);
//         }
//       });
//   }

//   ngAfterViewInit(): void {
//     console.log("this.popup",this.popup);
    
//     this.openPopup(this.popup);
//   }

//   openPopup(content: any): void {
//    // this.modalService.open(content, {backdrop: 'static', centered: true});
//   }

//   login(dismiss: any): void {
//     console.log("gvbuhbjhb",dismiss,this.phone);
    
//     this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
//     this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

//     if (this.currentUser) {
//       this.showScreen = true;
//      // dismiss();
//     }
//   }

//   selectUserHandler(phone: string|undefined): void {
//     this.selectedUser = this.userList.find(user => user.phone === phone);
//     console.log("  this.selectedUser",  this.selectedUser);
    
//     this.roomId = this.selectedUser.roomId[this.currentUser.id];
//     console.log("     this.roomId ",     this.roomId );

//     this.messageArray = [];

//     this.storageArray = this.chatService.getStorage();
//     const storeIndex = this.storageArray
//       .findIndex((storage) => storage.roomId === this.roomId);

//     if (storeIndex > -1) {
//       this.messageArray = this.storageArray[storeIndex].chats;
//     }

//     this.join(this.currentUser.name, this.roomId);
//   }

//   join(username: string, roomId: string): void {
//     this.chatService.joinRoom({user: username, room: roomId});
//   }

//   sendMessage(): void {
//     this.chatService.sendMessage({
//       user: this.currentUser.name,
//       room: this.roomId,
//       message: this.messageText
//     });

//     this.storageArray = this.chatService.getStorage();
//     const storeIndex = this.storageArray
//       .findIndex((storage) => storage.roomId === this.roomId);

//     if (storeIndex > -1) {
//       this.storageArray[storeIndex].chats.push({
//         user: this.currentUser.name,
//         message: this.messageText
//       });
//     } else {
//       const updateStorage = {
//         roomId: this.roomId,
//         chats: [{
//           user: this.currentUser.name,
//           message: this.messageText
//         }]
//       };

//       this.storageArray.push(updateStorage);
//     }

//     this.chatService.setStorage(this.storageArray);
//     this.messageText = '';
//   }
// }


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
  users:any=[]
  newMessage!: string;
  id!:string
  selectedUser:any
  currentUser='a2'
  private storageArray:any []= [];
  public Id!:string;
  userName!:string;
  
  constructor(private chatService: ChatService, private authService: AuthService,private route:Router) {}

  ngOnInit() {
    
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.id = (decoded as any).id;
      
      this.userName = (decoded as any).username;
      console.log( this.id, this.userName);
      
    } else {
      console.error('Token not found in localStorage');
    }
    this.findAllUsers();
   return this.chatService.getMessage().subscribe((message) => {
      console.log("message", message);
      this.messages.push(message);
      console.log( this.messages);
      
      if (this.Id) {
                  setTimeout(() => {
                    this.storageArray = this.chatService.getStorage();
                    const storeIndex = this.storageArray
                      .findIndex((storage) => storage.Id === this.Id);
                    this.messages = this.storageArray[storeIndex].chats;
                  }, 500);
                }
    });
    
  }

 
  findAllUsers(){
    this.authService.allUsers().subscribe(res=>{
      this.users=res;
      //console.log( this.users[0].username);
      
    })
  }
  // sendMessage() {
  //   const message = {
  //     content: this.newMessage,
  //     senderId: this.id,
  //     recipientId: this.selectedUser.id // Change this to dynamic recipient ID
  //   };
  //   console.log(message);
    
  //   this.chatService.sendMessage(message);
  //   this.newMessage = '';
  // }
  selectUserHandler(user:string){
const userName=user
this.selectedUser = this.users.find((user: { username: any; })=>user.username===userName);
console.log(this.selectedUser.id);
this.Id = this.selectedUser.id;
 


    this.messages = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.Id === this.Id);

    if (storeIndex > -1) {
      this.messages = this.storageArray[storeIndex].chats;
    }

    this.join(this.userName, this.Id);
  }

  join(username: string, Id: string): void {
    this.chatService.joinRoom({user: username, Id: Id});
  }
  sendMessage(): void {
    this.chatService.sendMessage({
      recipientId: this.selectedUser.id,
      senderId: this.id,
      content: this.newMessage
    });
   
    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.Id === this.Id);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.userName,
        content: this.newMessage
      });
    } else {
      const updateStorage = {
        Id: this.Id,
        chats: [{
          user: this.userName,
          content: this.newMessage
        }]
      };

      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);
    this.newMessage = '';
  }
  NavigateToCalling(id:string){
    console.log(id);
    if(id){
      this.route.navigate([`calling/${id}`])    
    }
    // else{
    //   this.route.navigate([`calling/${this.id}`])  
    // }
  }
}


