
import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {

  peer: Peer;
  localStream!: MediaStream  ;
  remoteStream!: MediaStream  ;
  peerConnection!: RTCPeerConnection;
  iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  constructor() {
    this.peer = new Peer();
  }

  async getMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      throw error;
    }
  }

  createPeerConnection(onRemoteStream: (stream: MediaStream) => void) {
    this.peerConnection = new RTCPeerConnection(this.iceServers);

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        onRemoteStream(this.remoteStream);
      }
      this.remoteStream.addTrack(event.track);
    };

    this.localStream?.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }
}
