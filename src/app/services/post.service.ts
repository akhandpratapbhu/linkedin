import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
   update : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true) 
  token: string | null;

  constructor(private http:HttpClient,) { 
     this.token = localStorage.getItem('token');
  }

  getPost(){
   return this. http.get('http://localhost:3000/api/feed')
  }
  feedPost(payload:any){
    console.log(payload,this.token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    
    return this.http.post('http://localhost:3000/api/feed',payload,httpOptions)
   }
}
