import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-linkedin-callback',
  standalone: true,
  imports: [],
  templateUrl: './linkedin-callback.component.html',
  styleUrl: './linkedin-callback.component.css'
})
export class LinkedinCallbackComponent implements OnInit{

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
  
  }
  linkedInLogin() {
    const clientId = '86j92g5rnt5gfa';//YOUR_LINKEDIN_CLIENT_ID
    const redirectUri = 'https://dev.example.com/auth/linkedin/callback';
    const state = 'DCEeFWf45A53sdfKef424'; // A unique string to prevent CSRF
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=foobar&scope=liteprofile%20emailaddress%20w_member_social`
                           // `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=r_liteprofile%20r_emailaddress`;
////https://www.linkedin.com/oauth/v2/authorization?_l=en_US

    window.location.href = linkedInAuthUrl;
    console.log( " window.location.href",window.location.href);
    if(window.location.href){
      this.setlinkedin();

    }
  }
  setlinkedin(){
    console.log("accessToken oninit");
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      console.log("code-state",code,state);

      if (code && state) {
        this.exchangeCodeForToken(code);
      }
    });
  }
  exchangeCodeForToken(code: string) {
    const clientId = '86j92g5rnt5gfa';
    const clientSecret = 'Ukm3QY8qdhrpH15g';
    const redirectUri = 'https://dev.example.com/auth/linkedin/callback';

    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&client_secret=${clientSecret}`;
console.log("tokenUrl",tokenUrl);

    this.http.post(tokenUrl, null).subscribe((response: any) => {
      const accessToken = response.access_token;
      console.log("accessToken",accessToken);
      
      this.fetchLinkedInProfile(accessToken);
    });
  }
  fetchLinkedInProfile(accessToken: string) {
    this.http.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).subscribe(profile => {
      console.log('LinkedIn profile:', profile);
    });
  }
}
