// social-login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { SocialLoginModule } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [SocialLoginModule],
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {



  user!: SocialUser;
  loggedIn: boolean | undefined;

  constructor(private authService: SocialAuthService, private router: Router,) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log("oninit",this.user ,this.loggedIn );
     
      if (this.user) {
        this.router.navigate(['/dashboard']);
  
      }
      
    });
  }
  

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
 

  signOut(): void {
    this.authService.signOut();
  }

  
}
