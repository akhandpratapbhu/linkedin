import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ToastrModule, MatIconModule, ReactiveFormsModule, FormsModule, MatProgressSpinnerModule, CommonModule],
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
    private authService: AuthService

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
    this.recaptchaWidgetId = grecaptcha.render('your-recaptcha-container-id', {
      'sitekey': '6LfZJs4pAAAAADyW-fE1-nomT3WPIjNDF9ZMReWp'
    });
    this.reloadRecaptcha();
    if (this.user) {
      this.router.navigate(['/dashboard']);

    }
    this.generateCaptcha()
  }
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
}
