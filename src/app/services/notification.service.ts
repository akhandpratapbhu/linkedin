import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:3000/api/notification';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }
}
