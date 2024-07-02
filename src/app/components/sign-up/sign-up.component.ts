
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ToastrModule,MatIconModule,ReactiveFormsModule,FormsModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  providers: [
    ToastrService,AuthService
  ]
})

export class SignUpComponent implements OnInit {
  hide = true;
  signUpForm: FormGroup;
  loading = false;
  user = '';
  userId!:string;
  action = 'homepage';

  token!: undefined;

  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService:AuthService,
    private mailService: MailService
   
  ) {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }


  ngOnInit(): void {
  

    if (this.user) {
      this.router.navigate(['/dashboard']);

    }
  
  }
  sendMail(userData:any) {
    
    this.mailService.sendConfirmation(userData.email, userData.username, '123456').subscribe(
      (response) => {
        this.toastr.success('Email sent successfully', response);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }
  onSubmit(): void {
    this.loading = true;
    
  // const sanitizedInput = this.captchaInp.replace(/\s/g, '');
    if (this.signUpForm.valid) {

      const userData = {
       username: (this.signUpForm.value.username),
       email: (this.signUpForm.value.email),
       phoneNumber: (this.signUpForm.value.phoneNumber),
       password:(this.signUpForm.value.password),
       
      }


      this.authService.signUp(userData).subscribe((res: any) => {
       
          this.loading = false;
          this.toastr.success("sign-Up successfully");
          this.sendMail(userData) 
          this.router.navigate([""]);
         
        
      },
        (error:any) => {
          
          this.toastr.error(error.error);
          this.loading = false;

        },
      )

    }
    else {
      this.toastr.warning("Please fill the login credentials first", "Warning!")
      this.loading = false;

    }

  }
  NavigateToLogin(){
    this.router.navigate([''])
  }
}
