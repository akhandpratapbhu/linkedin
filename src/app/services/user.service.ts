import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  update : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true) 
  token: string | null;
  constructor(private http:HttpClient,) { 
    this.token = localStorage.getItem('token');
  }

  uploadUserImage(body:any){

     const httpOptions = {
       headers: new HttpHeaders({
         'Authorization': 'Bearer ' + this.token
       })
     };
     
     return this.http.post(`http://localhost:3000/api/user/upload`,body,httpOptions)
    }
    getProfileImageUrl(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      };
      return this.http.get(`http://localhost:3000/api/user/image/4`)
    }
    getDefaultfullImagePath(){
      return 'http://localhost:3000/api/feed/image/download.png'
    }
    getfullImagePath(imageName:any){
      console.log(imageName);
      
      return `http://localhost:3000/api/feed/image/${imageName}`
    }
}
