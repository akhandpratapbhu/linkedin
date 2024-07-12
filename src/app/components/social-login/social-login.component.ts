// social-login.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [SocialLoginModule],
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
console.log(      this.user);

      if (this.user) {
        this.sendUserData(this.user)

      }

    });
  }


  signInWithFB(): void {
    console.log("facebook");

    const f = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log("facebook", f);
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

    this.authServices.loginWithGoogle(userData).subscribe((res: any) => {
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
