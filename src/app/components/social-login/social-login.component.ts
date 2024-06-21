// social-login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiLoaderService } from '../../services/google-api-loader.service.service';

declare const google: any;

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {

  constructor(private router: Router, private googleApiLoader: GoogleApiLoaderService) { }

  ngOnInit(): void {
    this.googleApiLoader.loadScript().then(() => {
      google.accounts.id.initialize({
        client_id: '619580621696-evh90so3evttspdgna3go72qittoa8tn.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this)
      });
      google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        {
          theme: 'outline',
          size: 'large',
          text: 'sign_in_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
      google.accounts.id.prompt();
    }).catch((error:any)=> {
      console.error('Error loading Google API script:', error);
    });
  }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    // Handle the credential response here (e.g., send to backend for verification)
    this.router.navigate(['/dashboard']);
  }
  handleLogout(): void {
    google.accounts.id.disableAutoSelect();
    console.log('User signed out.',google.accounts.id.disableAutoSelect());
    // Optionally, redirect the user to the login page or perform other actions
    this.router.navigate(['/register']);
  }
}
