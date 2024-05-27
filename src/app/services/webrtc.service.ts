// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebrtcService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  // localStream!: MediaStream;
  // remoteStream!: MediaStream;
  // peerConnection!: RTCPeerConnection;
  // iceServers = {
  //   iceServers: [
  //     { urls: 'stun:stun.l.google.com:19302' }
  //   ]
  // };

  // constructor() { }

  // async getMedia() {
  //   this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
  //   return this.localStream;
  // }

  // createPeerConnection() {
  //   this.peerConnection = new RTCPeerConnection(this.iceServers);
  //   this.remoteStream = new MediaStream();

  //   this.peerConnection.ontrack = (event) => {
  //     event.streams[0].getTracks().forEach(track => {
  //       this.remoteStream.addTrack(track);
  //     });
  //   };

  //   this.localStream.getTracks().forEach(track => {
  //     this.peerConnection.addTrack(track, this.localStream);
  //   });
  // }

  // async createOffer() {
  //   const offer = await this.peerConnection.createOffer();
  //   await this.peerConnection.setLocalDescription(offer);
  //   return offer;
  // }

  // async createAnswer() {
  //   const answer = await this.peerConnection.createAnswer();
  //   await this.peerConnection.setLocalDescription(answer);
  //   return answer;
  // }

  // async setRemoteDescription(sdp: RTCSessionDescriptionInit) {
  //   const remoteDesc = new RTCSessionDescription(sdp);
  //   await this.peerConnection.setRemoteDescription(remoteDesc);
  // }

  // async addIceCandidate(candidate: RTCIceCandidateInit) {
  //   await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  // }




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
