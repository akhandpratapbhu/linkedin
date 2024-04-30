import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,MatIconModule ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isVisible: boolean = false;

  closePopup() {
    this.isVisible = false;
  }
  onPost(message:string){
    console.log("form post",message);
 
  }
}
