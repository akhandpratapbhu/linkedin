import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  update : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true) 
  image:BehaviorSubject<string>=new BehaviorSubject<string>('')
  userId:BehaviorSubject<any>=new BehaviorSubject<any>('')
  token: string | null;
  id:any;
  constructor(private http:HttpClient,) { 
    this.token = localStorage.getItem('token');
    
    if (this.token) {
      const decoded = jwtDecode(this.token);
      this.id = (decoded as any).id;
    }
  }
  setUserId(userId:any){
    console.log("userId",userId);
    
    this.userId.next(userId)
  }
  getuserId(): Observable<string> {
    return this.userId.asObservable();
  }
  setImageUrl(imageUrl:string){
    this.image.next(imageUrl)
  }
  getImageUrl(): Observable<string> {
    return this.image.asObservable();
  }
  getUserByUserName(name:string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(`http://localhost:3000/api/user/search/${name}`)
  }
  
  uploadUserImage(body:any){

     const httpOptions = {
       headers: new HttpHeaders({
         'Authorization': 'Bearer ' + this.token
       })
     };
     
     return this.http.post(`http://localhost:3000/api/user/upload`,body,httpOptions)
    }
    uploadUserbackgroundImage(body:any){

      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      };
      
      return this.http.post(`http://localhost:3000/api/user/uploadbackgroundimage`,body,httpOptions)
     }
    getProfileImageUrl(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      };
      return this.http.get(`http://localhost:3000/api/user/image/${this.id}`)
    }
    
    getProfileImageName(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      };
      return this.http.get(`http://localhost:3000/api/user/image-name/${this.id}`,httpOptions)
    }
    getDefaultfullImagePath(){
      return 'http://localhost:3000/api/feed/image/user.png'
    }
    getfullImagePath(imageName:any){
      
      return `http://localhost:3000/api/feed/image/${imageName}`
    }
}
