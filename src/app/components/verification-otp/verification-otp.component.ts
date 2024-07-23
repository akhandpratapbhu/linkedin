import { Component } from '@angular/core';
import { MailService } from '../../services/mail.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verification-otp',
  standalone: true,
  imports: [],
  templateUrl: './verification-otp.component.html',
  styleUrl: './verification-otp.component.css'
})
export class VerificationOtpComponent {
  otpAndMail: any;
  otp!: string
  constructor(private mailService: MailService, private router: Router,
    private toastr: ToastrService) {
    this.otpAndMail = this.mailService.getOtpVerify()
    this.otp = this.otpAndMail.otp
    console.log("this.otp", this.otp);

  }
  checkVerifyOtp(inputotp: string) {
    console.log(inputotp);
    if (this.otp == inputotp) {
      this.router.navigate(['/forget-password'])
    } else {
      this.toastr.error('otp wrong go back and try again forget password');
    }

  }
}
