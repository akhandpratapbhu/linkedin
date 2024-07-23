// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class MailService {

//   private apiUrl = 'http://localhost:3000/api/mail/send-confirmation';
// otp!:string
// mail!:string
//   constructor(private http: HttpClient) {}

//   sendConfirmation(email: string, name: string, token: string): Observable<any> {
    
//     const body = { email, name, token };

//     return this.http.post<any>(this.apiUrl, body);
//   }
//   sendConfirmationOtp(email: string, otp: string): Observable<any> {
    
//     const body = { email,otp };
// console.log(body);

//     return this.http.post<any>('http://localhost:3000/api/mail/send-otp', body);
//   }
//   setOtpInVerify(mail:string,otp:string){
//     this.otp=otp;
//     this.mail=mail;
//   }
//   getOtpVerify(){
//     return {otp:this.otp,mail:this.mail};
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = 'http://localhost:3000/api/mail/send-confirmation';
  
  // BehaviorSubjects to hold the latest values of email and otp
  private emailSubject = new BehaviorSubject<string>('');
  private otpSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  sendConfirmation(email: string, name: string, token: string): Observable<any> {
    const body = { email, name, token };
    return this.http.post<any>(this.apiUrl, body);
  }

  sendConfirmationOtp(email: string, otp: string): Observable<any> {
    const body = { email, otp };
    console.log(body);

    // Update the BehaviorSubjects with new values
    this.emailSubject.next(email);
    this.otpSubject.next(otp);

    return this.http.post<any>('http://localhost:3000/api/mail/send-otp', body);
  }

  setOtpInVerify(mail: string, otp: string): void {
    this.emailSubject.next(mail);
    this.otpSubject.next(otp);
  }

  getOtpVerify(): { otp: string, mail: string } {
    return {
      otp: this.otpSubject.value,
      mail: this.emailSubject.value
    };
  }

  // Additional methods to get the current values as Observables
  getEmail(): Observable<string> {
    return this.emailSubject.asObservable();
  }

  getOtp(): Observable<string> {
    return this.otpSubject.asObservable();
  }
}
