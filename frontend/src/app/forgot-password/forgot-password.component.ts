import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';

  constructor(private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe({
        next: (response) => {
          // Success message logic
          this.notificationService.triggerNotification(`Password reset link sent to email:, ${this.email}`, 'success');
          console.log('Password reset link sent to email:', this.email);
        },
        error: (error) => {
          // Error message logic
          this.notificationService.triggerNotification('Failed to send password reset link', 'error');
          console.error('Failed to send password reset link:', error);
        }
      });
    }
  }
}
