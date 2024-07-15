// social-login.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LinkedinCallbackComponent } from '../linkedin-callback/linkedin-callback.component';


@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [SocialLoginModule,LinkedinCallbackComponent],
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit, OnDestroy {


  loading = false;
  user!: SocialUser;
  loggedIn: boolean | undefined;
  subscription!: Subscription;
  constructor(private authService: SocialAuthService, private router: Router,
    private toastr: ToastrService,
    private authServices: AuthService,
  ) { }

  ngOnInit() {
    this.subscription = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if (this.user) {
        this.sendUserData(this.user)

      }

    });
  }
 

  signInWithFB(): void {
    console.log("facebook");

    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


  sendUserData(user: any) {
    this.loading = true;
    const userData = {
      email: user.email,
      image: user.photoUrl,
      username: user.name,
      phoneNumber: "",
      password: ""
    }

    this.authServices.loginWithSocialSignIn(userData).subscribe((res: any) => {
      localStorage.setItem('token', res.token)
      this.loading = false;
      this.toastr.success("login successfully");
      this.router.navigate(["dashboard"]);

    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.authService.signOut()
    }
  }
}
