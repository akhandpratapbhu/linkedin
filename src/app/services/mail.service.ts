import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = 'http://localhost:3000/api/mail/send-confirmation';

  constructor(private http: HttpClient) {}

  sendConfirmation(email: string, name: string, token: string): Observable<any> {
    
    const body = { email, name, token };
    console.log("body",body);

    return this.http.post<any>(this.apiUrl, body);
  }
}
