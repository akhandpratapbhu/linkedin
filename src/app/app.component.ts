import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ConnectionProfileService } from './services/connection-profile.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import Peer from 'peerjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'linkedin';

  peerIdShare!: string;
  peerId!: string | null;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  incomingCall: boolean = false;
  ringing: boolean = false;
  private currentCall: any;
  isInCall: boolean = false;
  userId: any;
  data:any;
  userName:any;
  imagePath:any;
  selectedUserId: any;
  userId1!:any;
  constructor(private authService:AuthService,private userService:UserService) {
  }
  ngOnInit(): void {
    this.userService.getImageUrl().subscribe(url => {
      this.userId1 = url;
      console.log(" this.uuserId1", this.userId1);
      
    });
    this.usertokenId()
  }
  usertokenId() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
       this.userId = (decoded as any).id;
      
      this.initializePeer()
    } else {
      console.error('Token not found in localStorage');
    }
  }
  initializePeer() {
    if (this.authService.peer) {
      console.log(this.authService.peer);
      
      console.warn('Peer is already initialized. Destroying existing Peer instance.');
      this.authService.peer.destroy();
      this.authService.peer = null;
      console.log(this.authService.peer);
    }
  
    try {
      this.authService.peer = new Peer(this.userId, {
        // Configuration options can be added here if needed
      });
  
      this.authService.peer.on('open', (id) => {
        this.peerId = this.userId;
      //  console.log('Peer ID:', this.peerId);
      });
  
      this.authService.peer.on('call', (call) => {
        this.incomingCall = true;
        this.authService.ringingSubject.next(true)
        this.authService.userIdSubject.next(1)
        this.currentCall = call;
        this.ringing = true;
  
        call.on('close', () => {  
          this.incomingCall = false;
          this.ringing = false;
          this.isInCall = false;
          this.authService.ringingSubject.next(false)
        });
      
        
        
      });
  
      this.authService.peer.on('disconnected', () => {
        console.warn('Peer disconnected. Attempting to reconnect...');
        this.authService.peer?.reconnect();
      });
  
      this.authService.peer.on('error', (err) => {
        console.error('Peer error:', err);
      });
    } catch (error) {
      console.error('Error initializing Peer:', error);
    }
   
  }
}
