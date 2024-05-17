import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionProfileService {
  token!:string|null;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
   }
  
   getConnectionUser(id:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(`http://localhost:3000/api/auth/${id}`)
  }
  getFriendRequestStatus(id:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(`http://localhost:3000/api/user/friend-request/status/${id}`,httpOptions)
  }
  addConnectionUser(id:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.post(`http://localhost:3000/api/user/friend-request/send/${id}`,{},httpOptions)
  }
  getFriendRequest(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(`http://localhost:3000/api/user/friend-request/me/:recieved-requests`,httpOptions)
  }
  responseToFriendRequest(id:number,statusResponse:any){
    console.log(id,statusResponse);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.put(`http://localhost:3000/api/user/friend-request/response/${id}`,statusResponse,httpOptions)
  }
}
