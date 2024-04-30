import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { StartPostComponent } from '../start-post/start-post.component';
import { AdvertisingComponent } from '../advertising/advertising.component';
import { AllPostComponent } from '../all-post/all-post.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StartPostComponent,HeaderComponent,AdvertisingComponent,AllPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
