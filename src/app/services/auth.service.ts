import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Peer } from 'peerjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null;
   peer!: Peer|null;
  ringingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ringing$ = this.ringingSubject.asObservable(); // Expose as Observable for other components to subscribe

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token');
    console.log('Initial ringing status:', this.ringingSubject.value);
    this.setRingingStatus(false)
  }
  

  setRingingStatus(status: boolean): boolean {
    this.ringingSubject.next(status);
    console.log('Ringing status set to:', status,this.ringingSubject.value);
    this.getRingingStatus()
    return this.ringingSubject.value;
  }

 getRingingStatus(): boolean {
    console.log('Getting ringing status:', this.ringingSubject.value);
    this.shouldShowCall()
    return this.ringingSubject.value;
  }

  shouldShowCall(): boolean {
    console.log(this.ringingSubject.value);
    
    return this.ringingSubject.value;
  }
  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');
  }
  signIn(payload: any) {
    console.log("payload", payload);

    return this.http.post('http://localhost:3000/api/auth/login', payload)
  }
  signUp(payload: any) {
    console.log("payload", payload);

    return this.http.post('http://localhost:3000/api/auth/register', payload)
  }
  allUsers() {

    return this.http.get('http://localhost:3000/api/user')
  }
 
  
}
