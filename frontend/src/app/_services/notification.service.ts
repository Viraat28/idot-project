import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../notification/notification.component'; 

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSource = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSource.asObservable();

  constructor() {}

  triggerNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notificationSource.next({ message, type });
    setTimeout(() => this.notificationSource.next(null), 3000); // Automatically hide after 3 seconds
  }
}
