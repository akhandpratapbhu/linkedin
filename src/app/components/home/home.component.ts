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
  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit() {
    this.ringingSubscription = this.authService.ringing$.subscribe(status => {
      this.ringingStatus = status;
      console.log('Ringing status start in HomeComponent:', this.ringingStatus);

      if(this.ringingStatus==true){
        this.router.navigate(['/dashboard/call/user'], { state : {ringing : true}})
        
      }else{
        this.router.navigate(['/dashboard'], { state : {ringing : false}})
      } 
      console.log('Ringing status updated in HomeComponent:', this.ringingStatus);
    });
    this.userIdSubscription = this.authService.userId$.subscribe(id => {
      this.userIdStatus = id;
      console.log('userid status start in HomeComponent:', this.userIdStatus);

    });
  }

  ngOnDestroy() {
    if (this.ringingSubscription ) {
      this.ringingSubscription.unsubscribe();
    }
  }


}
