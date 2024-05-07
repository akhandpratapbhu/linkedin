import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import {MatIconModule} from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-start-post',
  standalone: true,
  imports: [ModalComponent,MatIconModule],
  templateUrl: './start-post.component.html',
  styleUrl: './start-post.component.css'
})
export class StartPostComponent {

  constructor(public dialog: MatDialog) {

  }
  openDialogBox(): void { 
     this.dialog.open(ModalComponent, {
      width: '350px',
      height:'250px'
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
