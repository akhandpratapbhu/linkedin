import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  signIn(payload:any){
    console.log("payload",payload);
    
   return this.http.post('http://localhost:3000/api/feed',payload)
  }
  signUp(payload:any){
    console.log("payload",payload);
    
   return this.http.post('http://localhost:3000/api/feed',payload)
  }
}
