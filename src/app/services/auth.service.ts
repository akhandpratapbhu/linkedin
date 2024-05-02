import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
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
}
