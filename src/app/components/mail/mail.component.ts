import { Component } from '@angular/core';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.css'
})
export class MailComponent {

  title = 'email-client';

  constructor(private mailService: MailService) {}

  sendMail() {
    this.mailService.sendConfirmation('akhandpratap121196@gmail.com', 'Akhand Pratap', '123456').subscribe(
      (response) => {
        console.log('Email sent successfully', response);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }
}
