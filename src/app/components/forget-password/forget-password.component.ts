import { Component } from '@angular/core';
import { MailService } from '../../services/mail.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  otpAndMail: any;
  mail!: string
  constructor(private mailService: MailService, private router: Router,
    private toastr: ToastrService,private authService :AuthService) {
    this.otpAndMail = this.mailService.getOtpVerify()
    this.mail = this.otpAndMail.mail
    console.log("this.mail", this.mail);

  }
  setNewPassword(newPassword: string, confirmPassword: string) {
    console.log(newPassword, confirmPassword);
    if (newPassword === confirmPassword) {
      console.log("same password");
      this.changeNewPassword(this.mail, newPassword)
    } else {
      console.log(" password is not matching both");
    }

  }
  changeNewPassword(mail: string, newPassword: string) {
    console.log(mail, newPassword);
    this.authService.changePassword(mail,newPassword).subscribe(res=>{
      console.log(res);
      this.toastr.success("Password changed successfully..")
      this.router.navigate([''])
      
    })
  }
}
