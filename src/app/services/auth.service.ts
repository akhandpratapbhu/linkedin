import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Peer } from 'peerjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null;
  peer!: Peer | null;
  ringingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ringing$ = this.ringingSubject.asObservable();
  userIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');

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
