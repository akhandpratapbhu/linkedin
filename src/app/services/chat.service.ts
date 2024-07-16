import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

private socket: Socket;
  private url = 'http://localhost:3000'; // your server local path

  constructor() {
    this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
  }
  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', { roomId });
  }

  sendMessage(roomId: string, message: any) {
    this.socket.emit('sendMessage', { roomId, message });
  }

  getMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (message) => {
        console.log("message",message);
        
        observer.next(message);
      });
    });
  }
   getStorage() {
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }
 
}
