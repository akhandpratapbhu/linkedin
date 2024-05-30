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

  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit() {
    this.authService.ringingSubject.subscribe((val : boolean)=>{
      console.log(val, "this is the value")
      if(val==true) this.router.navigate(['/dashboard/call/user'], { state : {ringing : true}})
    })
    this.ringingSubscription = this.authService.ringing$.subscribe(status => {
      this.ringingStatus = status;
      console.log('Ringing status updated in HomeComponent:', this.ringingStatus);
    });
  }

  ngOnDestroy() {
    if (this.ringingSubscription) {
      this.ringingSubscription.unsubscribe();
    }
  }
}
