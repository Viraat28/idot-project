import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.token = this.activatedRoute.snapshot.params['token'];
  }

  resetPassword(newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      // Handle password mismatch
      //console.error('Passwords do not match');
      this.notificationService.triggerNotification('Passwords do not match', 'error');
      return;
    }
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        // Handle success response
        console.log(response);
        this.notificationService.triggerNotification('Password reset is successful', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Handle error response
        console.error(error);
        this.notificationService.triggerNotification('Passwords reset is failed', 'error');
     
      }
    });
  }
}
