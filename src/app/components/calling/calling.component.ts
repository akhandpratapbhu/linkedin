import { Component, OnInit } from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { HttpClient } from '@angular/common/http';
import Peer from 'peerjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-calling',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './calling.component.html',
  styleUrl: './calling.component.css'
})
export class CallingComponent implements OnInit {

  private peer: Peer;
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
  constructor(private route: ActivatedRoute, private connectionProfile: ConnectionProfileService,private userService:UserService) {
    this.peer = new Peer();
  }

  ngOnInit(): void {

    this.selectedUser()
    this.usertokenId()
  }
  ngOnDestroy(): void {
    if (this.peer) {
      this.peer.destroy();
    }
  }

  getConnectionUserProfile(id: any) {
    this.connectionProfile.getConnectionUser(id).subscribe(res => {

      this.data = res
      if (this.data && Array.isArray(this.data) && this.data.length > 0) {
        const imagePath = this.data[0].image;
        this.userName = this.data[0].username
        // Access the image property from the first object

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
      console.log('   this.username:', this.selectedUserId);
    });
    this.getConnectionUserProfile( this.selectedUserId)
  }
  usertokenId() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
       this.userId = (decoded as any).id;
       //this.getConnectionUserProfile( this.userId)
      console.log(this.userId);
      this.initializePeer()
    } else {
      console.error('Token not found in localStorage');
    }
  }
  initializePeer() {
    if (this.peer) {
      console.log(this.peer);
      
      console.warn('Peer is already initialized. Destroying existing Peer instance.');
      this.peer.destroy();
      console.log(this.peer);
    }
  
    try {
      this.peer = new Peer(this.userId, {
        // Configuration options can be added here if needed
      });
  
      this.peer.on('open', (id) => {
        this.peerId = this.userId;
        console.log('Peer ID:', this.peerId);
      });
  
      this.peer.on('call', (call) => {
        this.incomingCall = true;
        this.currentCall = call;
        this.ringing = true;
  
        call.on('close', () => {
          this.incomingCall = false;
          this.ringing = false;
          this.isInCall = false;
        });
      });
  
      this.peer.on('disconnected', () => {
        console.warn('Peer disconnected. Attempting to reconnect...');
        this.peer.reconnect();
      });
  
      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
      });
    } catch (error) {
      console.error('Error initializing Peer:', error);
    }
  }
  

  connectWithPeer(): void {
    this.callPeer(this.selectedUserId);
    console.log('Connecting with peer ID:', this.selectedUserId);
  }

  private callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      const call = this.peer.call(id, stream);
      this.ringing = true;

      call.on('stream', (remoteStream) => {
        this.ringing = false;
        this.isInCall = true;
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });

      call.on('close', () => {
        this.ringing = false;
        this.isInCall = false;
        this.endCall();
      });
    }).catch(err => {
      console.log(err + ' Unable to connect');
    });
  }

  answerCall(): void {
    this.incomingCall = false;
    this.ringing = false;

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;
      this.isInCall = true;

      this.currentCall.answer(stream);
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
    this.currentCall.close();
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
  }
}


