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
    if (localStorage.getItem('token') || localStorage.getItem('loginWithGoogle')) {
      return true
    } else {
      return false;
    }
  }
  loginWithSocialSignIn(payload: any) {

    return this.http.post('http://localhost:3000/api/auth/loginWithSocialSignIn', payload)
  }
  signIn(payload: any) {

    return this.http.post('http://localhost:3000/api/auth/login', payload)
  }
  signUp(payload: any) {

    return this.http.post('http://localhost:3000/api/auth/register', payload)
  }
  allUsers() {

    return this.http.get('http://localhost:3000/api/user')
  }
  changePassword(mail:string,newPassword:string){
 const payload={
  email:mail,
  password:newPassword
 }
 return this.http.post('http://localhost:3000/api/auth/changePassword', payload)
  }

}
