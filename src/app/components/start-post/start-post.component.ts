import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-start-post',
  standalone: true,
  imports: [ModalComponent,MatIconModule],
  templateUrl: './start-post.component.html',
  styleUrl: './start-post.component.css'
})
export class StartPostComponent {
  showPopup: boolean = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
}