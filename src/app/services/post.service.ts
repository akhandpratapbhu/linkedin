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
   findPostById(id:string){
   
     const httpOptions = {
       headers: new HttpHeaders({
         'Authorization': 'Bearer ' + this.token
       })
     };
     return this.http.get(`http://localhost:3000/api/feed/${id}`,httpOptions)
    }
   editPost(id:string,body:any){
   // http://localhost:3000/api/feed/7
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    
    return this.http.put(`http://localhost:3000/api/feed/${id}`,body,httpOptions)
   }
   deletePostById(id:string){
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.delete(`http://localhost:3000/api/feed/${id}`,httpOptions)
   }
}
