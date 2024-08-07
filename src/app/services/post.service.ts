import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  update: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  token: string | null;
  loginWithGoogle: string | null;
  image: any;
  imageUrl: BehaviorSubject<string> = new BehaviorSubject<string>('')
  constructor(private http: HttpClient, private userService: UserService) {
    this.token = localStorage.getItem('token');
    this.loginWithGoogle = localStorage.getItem('loginWithGoogle');
    this.userService.getProfileImageName().subscribe(res => {

      this.image = res;
      if (this.image.image) {
        this.imageUrl.next(this.userService.getfullImagePath(this.image.image));
      } else {
        this.userService.getDefaultfullImagePath()
      }
    })

  }

  getPost() {
    return this.http.get('http://localhost:3000/api/feed')
  }
  postLike(postId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.post(`http://localhost:3000/api/likes/${postId}`, {}, httpOptions)
  }
  getLikes(postId: number){
    return this.http.get(`http://localhost:3000/api/likes/${postId}`);
  }
  getComments(postId: number) {
    return this.http.get(`http://localhost:3000/api/comments/${postId}`);
  }
  commentOnPost(postId:any,content:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.post(`http://localhost:3000/api/comments/${postId}`,content, httpOptions)
  }
  feedPost(payload: any) {
    let authtoken: any
    if (this.token) {
      authtoken = this.token;

    } else if (this.loginWithGoogle) {
      authtoken = this.loginWithGoogle;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + authtoken
      })
    };

    return this.http.post('http://localhost:3000/api/feed', payload, httpOptions)
  }
  findPostById(id: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.get(`http://localhost:3000/api/feed/${id}`, httpOptions)
  }
  editPost(id: string, body: any) {
    // http://localhost:3000/api/feed/7
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.put(`http://localhost:3000/api/feed/${id}`, body, httpOptions)
  }
  deletePostById(id: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.http.delete(`http://localhost:3000/api/feed/${id}`, httpOptions)
  }
}
