import { Component, OnDestroy, OnInit} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { StartPostComponent } from '../start-post/start-post.component';
import { AdvertisingComponent } from '../advertising/advertising.component';
import { AllPostComponent } from '../all-post/all-post.component';
import { ProfileSummaryComponent } from '../profile-summary/profile-summary.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StartPostComponent, HeaderComponent, AdvertisingComponent, AllPostComponent,ProfileSummaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy  {
  ringingStatus: boolean | undefined;
  private ringingSubscription: Subscription | undefined;
  userIdStatus: any| undefined;
  private userIdSubscription: Subscription | undefined;
  private audio = new Audio('assets/img/ring-tone-faf-7-12026.mp3');

  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit() {
    this.ringingSubscription = this.authService.ringing$.subscribe(status => {
      this.ringingStatus = status;

      if(this.ringingStatus==true){
       // this.playRingtone();
        this.router.navigate(['/dashboard/call/user'], { state : {ringing : true}})
        
      }else if(this.ringingStatus==false){
        this.stopRingtone()
        this.router.navigate(['/dashboard'], { state : {ringing : false}})
      } 
    });
    this.userIdSubscription = this.authService.userId$.subscribe(id => {
      this.userIdStatus = id;

    });
  }
  private playRingtone(): void {
    this.audio.loop = true; // Loop the audio for continuous ringing
    this.audio.play();
  }

  private stopRingtone(): void {    
    this.audio.pause();
    this.audio.currentTime = 0; // Reset the audio to the beginning
  }
  ngOnDestroy() {
    if (this.ringingSubscription ) {
      this.ringingSubscription.unsubscribe();
    }
  }


}
