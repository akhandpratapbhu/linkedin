import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { GoogleApiLoaderService } from '../../services/google-api-loader.service.service';
import { jwtDecode } from 'jwt-decode';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { SocialLoginComponent } from '../social-login/social-login.component';

declare const google: any;
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ToastrModule, MatIconModule, ReactiveFormsModule, FormsModule, MatProgressSpinnerModule, CommonModule,SocialLoginComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [
    ToastrService, AuthService
  ]
})

export class SignInComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  captcha = ''
  captchaInp = ''
  user = '';
  userId!: string;
  captchaToken!: string;
  action = 'homepage';

  token!: undefined;


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
     private googleApiLoader: GoogleApiLoaderService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }


  recaptchaWidgetId: number | undefined;
  ngOnInit(): void {
    //this.signInWithGoogle();
    this.recaptchaWidgetId = grecaptcha.render('your-recaptcha-container-id', {
      'sitekey': '6LfZJs4pAAAAADyW-fE1-nomT3WPIjNDF9ZMReWp'
    });
    this.reloadRecaptcha();
    if (this.user) {
      this.router.navigate(['/dashboard']);

    }
    this.generateCaptcha()
  }
  // signInWithGoogle(){
  //   this.googleApiLoader.loadScript().then(() => {
  //     google.accounts.id.initialize({
  //       client_id: '619580621696-evh90so3evttspdgna3go72qittoa8tn.apps.googleusercontent.com',
  //       callback: this.handleCredentialResponse.bind(this)
  //     });
  //     google.accounts.id.renderButton(
  //       document.getElementById('g_id_signin'),
  //       {
  //         theme: 'outline',
  //         size: 'large',
  //         text: 'sign_in_with',
  //         shape: 'rectangular',
  //         logo_alignment: 'left'
  //       }
  //     );
  //     google.accounts.id.prompt();
  //   }).catch((error:any)=> {
  //     console.error('Error loading Google API script:', error);
  //   });
  // }
  reloadRecaptcha() {
    // Reset reCAPTCHA widget
    grecaptcha.reset(this.recaptchaWidgetId);
  }
  onSubmit(): void {
    this.loading = true;
    const reCaptchaResponse = grecaptcha.getResponse();

    //  if(!this.captchaInp){
    //  this.toastr.warning("Please Enter The Captcha");
    //   this.generateCaptcha();
    //   this.loading = false;

    //   return;
    // }
    // else if (this.captcha !== this.captchaInp) {
    //   this.toastr.error("Invalid Captcha");
    //   this.generateCaptcha();
    //   this.loading = false;

    //    return;
    //  }
    // const sanitizedInput = this.captchaInp.replace(/\s/g, '');
    if (this.loginForm.valid) {

      const userData = {
        email: (this.loginForm.value.email),
        password: (this.loginForm.value.password),
        captcha:reCaptchaResponse
      }


      this.authService.signIn(userData).subscribe((res: any) => {
        console.log("res", res);
         localStorage.setItem('token',res.token)
        this.loading = false;
        this.toastr.success("login successfully");
        this.router.navigate(["dashboard"]);

      },
        (error: any) => {
          console.log("error", error);

          this.toastr.error(error.message);
          this.loading = false;
          this.generateCaptcha()

        },
      )

    }
    else {
      this.toastr.warning("Please fill the login credentials first", "Warning!")
      this.loading = false;

    }

  }
  NavigateToRegister() {
    this.router.navigate(["/register"]);
  }
  generateCaptcha(length = 6) {
    this.captchaInp = ''
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let captcha = '';
    for (let i = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      captcha += characters.charAt(randomIndex);
    }

    this.captcha = captcha
  }
  // handleCredentialResponse(response: any) {
  //   console.log('Encoded JWT ID token: ' + response.credential);
  //  // localStorage.setItem('loginWithGoogle', response.credential)
  //  // const loginWithGoogle = localStorage.getItem('loginWithGoogle');
  //  const loginWithGoogle=response.credential;
  //   if(loginWithGoogle){
  //     const decoded = jwtDecode(loginWithGoogle);
  //      const userName = (decoded as any).name;
  //     const picture=(decoded as any).picture;
  //     const email=(decoded as any).email
  //     console.log(  userName, picture);
  //     const userData = {
  //       email:email,
  //       image: picture,
  //       username:userName,
  //       phoneNumber:"",
  //       password:""
  //     }
      
  //     this.authService.loginWithGoogle(userData).subscribe((res: any) => {
  //       console.log("res", res);
  //        localStorage.setItem('token',res.token)
  //       this.loading = false;
  //       this.toastr.success("login successfully");
  //       this.router.navigate(["dashboard"]);

  //     })

  //   }
  
  // }
}