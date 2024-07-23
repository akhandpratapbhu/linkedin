import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications: any[] = [];
  userId!:any

  constructor(private notificationService: NotificationService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      this.userId = (decoded as any).id
   }
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.userId).subscribe(
      (data) => {
        this.notifications = data;
        console.log("  this.notifications", this.notifications);

      },
      (error) => {
        console.error('Failed to load notifications', error);
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  check() {
    Notification.requestPermission().then(perm => {
      alert(perm)
      if (perm === 'granted') {
        const notification = new Notification("linkedin notification",
          {
            body: Math.random().toString(),
            data: { hello: "world" },
          })
      }
    })
  }
}
