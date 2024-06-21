import { Component, OnInit } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { HttpClient } from '@angular/common/http';
import Peer from 'peerjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calling',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './calling.component.html',
  styleUrl: './calling.component.css'
})
export class CallingComponent implements OnInit {

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
  data: any;
  userName: any;
  imagePath: any;
  selectedUserId: any;
  user: any
  private audio = new Audio('assets/img/ring-tone-faf-7-12026.mp3');
  private userIdSubscription!: Subscription;
  constructor(private route: ActivatedRoute, private connectionProfile: ConnectionProfileService,
    private userService: UserService, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.usertokenId(this.user)
    this.userIdSubscription = this.authService.userId$.subscribe(id => {
      this.user = id;
    });

    this.selectedUser()
    this.incomingCall = history.state.ringing
     this.connectWithPeer()
  }


  ngOnDestroy() {

    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
  getConnectionUserProfile(id: any) {
    if (!id) {
      id = this.user
    }

    this.connectionProfile.getConnectionUser(id).subscribe(res => {

      this.data = res
      if (this.data && Array.isArray(this.data) && this.data.length > 0) {
        const imagePath = this.data[0].image;
        this.userName = this.data[0].username

        if (imagePath !== null) {
          this.imagePath = this.userService.getfullImagePath(imagePath);

        } else {
          this.imagePath = this.userService.getDefaultfullImagePath();
        }
      }
    })
  }
  selectedUser() {
    this.route.paramMap.subscribe(params => {

      this.selectedUserId = params.get('id'); // The 'id' here should match the parameter in your route definition
    });
    this.connectWithPeer()
    this.getConnectionUserProfile(this.selectedUserId)
  }
  usertokenId(user: any) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userId = (decoded as any).id;
      //this.getConnectionUserProfile( this.userId)
      this.userService.setUserId( this.userId)
      this.initializePeer()
    } else {
      console.error('Token not found in localStorage');
    }
  }
  initializePeer() {

    try {
      console.log(this.authService.peer, "uyhdfehbfibxfhur");
      this.userService.setUserId( this.userId)
      if (!this.authService.peer) {
        return
      }
      this.authService.peer.on('open', (id) => {
        console.log(this.authService.peer, "open");
        this.peerId = this.userId;
        console.log('Peer ID:', this.peerId);
      });


      this.authService.peer.on('call', (call) => {
        this.incomingCall = true;
        console.log('Incoming call:', call);

        this.currentCall = call;
        this.ringing = true;

        console.log('After setting currentCall:', this.currentCall);

        call.on('close', () => {
          this.incomingCall = false;
          this.ringing = false;
          this.isInCall = false;
          console.log('Call ended, resetting flags.');
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


  connectWithPeer(): void {
    this.userService.setUserId( this.userId)
    this.callPeer(this.selectedUserId);
    console.log('Connecting with peer ID:', this.selectedUserId);
  }

  private callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then((stream) => {
      console.log('Microphone access granted');
      this.lazyStream = stream;

      const call = this.authService.peer?.call(id, stream);
      this.ringing = true;
      if (this.ringing) {
        this.playRingtone();
      } else {
        this.stopRingtone();
      }

      call?.on('stream', (remoteStream) => {
        this.ringing = false;
        this.isInCall = true;
        if (this.ringing) {
          this.playRingtone();
        } else {
          this.stopRingtone();
        }
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });

      call?.on('close', () => {
        this.ringing = false;
        this.isInCall = false;
        this.endCall();
      });
    }).catch(err => {
      console.log(err + ' Unable to connect');
    });
  }


  answerCall(): void {
    console.log('Incoming call:', this.currentCall);

    // Make sure `this.currentCall` is defined
    if (!this.currentCall) {
      console.log('currentCall is undefined');
      return;
    }

    this.incomingCall = false;
    this.ringing = false;
    if (!this.incomingCall || !this.ringing) {
      this.stopRingtone();
    }

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;
      this.isInCall = true;

      // Ensure `this.currentCall.answer` is a function
      if (typeof this.currentCall.answer === 'function') {
        this.currentCall.answer(stream);
      } else {
        console.log('currentCall.answer is not a function');
        return;
      }

      this.currentCall.on('stream', (remoteStream: any) => {
        if (!this.peerList.includes(this.currentCall.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = this.currentCall.peerConnection;
          this.peerList.push(this.currentCall.peer);
        }
      });

      this.currentCall.on('close', () => {
        this.isInCall = false;
        this.endCall();
      });
    }).catch(err => {
      console.log(err + ' Unable to get media');
    });
  }

  declineCall(): void {
    this.incomingCall = false;
    this.ringing = false;
    this.stopRingtone();
    this.currentPeer = null;
    this.router.navigate(['dashboard'])
  }

  private streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    const remoteVideoContainer = document.getElementById('remote-video');
    if (remoteVideoContainer) {
      remoteVideoContainer.appendChild(video);
    }
  }

  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find((s: { track: { kind: string; }; }) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s: { track: { kind: any; }; }) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }

  endCall(): void {
    if (this.currentPeer) {
      this.currentPeer.close();
      this.currentPeer = null;
      this.peerList = [];

      const remoteVideoContainer = document.getElementById('remote-video');
      if (remoteVideoContainer) {
        remoteVideoContainer.innerHTML = ''; // Clear the remote video container
      }
    }

    if (this.lazyStream) {
      this.lazyStream.getTracks().forEach((track: any) => track.stop());
      this.lazyStream = null;
    }

    this.isInCall = false;
    this.ringing = false;
    this.authService.ringingSubject.next(false)
    this.stopRingtone();
    this.router.navigate(['dashboard'])
  }
  private playRingtone(): void {
    this.audio.loop = true; // Loop the audio for continuous ringing
    this.audio.play();
  }

  private stopRingtone(): void {
    this.audio.pause();
    this.audio.currentTime = 0; // Reset the audio to the beginning
  }
}



