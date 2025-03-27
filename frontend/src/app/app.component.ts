import { Component } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    console.log('isloggedin',this.isLoggedIn);
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }

  // logout(): void {
  //   this.authService.logout().subscribe({
  //     next: res => {
  //       console.log(res);
  //       this.storageService.clean();
  //       window.location.reload();
  //       this.router.navigate(['/login']);
  //     },
  //     error: err => {
  //       console.log(err);
  //     }
  //   });
  // }
  logout(): void {
    this.authService.logout().pipe(
      finalize(() => console.log('Logout request completed'))
    ).subscribe({
      next: data => {
        this.storageService.clean(); // Clear all storage and session info
        console.log("loggedout");
        this.router.navigate(['/login'])
        .then(() => {
          window.location.reload(); // Force reload to clear any cached data
        });
      },
      error: err => {
        console.error("Logout error:", err);
      },
      complete: () => {
        console.log("Subscription completed"); // Check if this gets logged
      }
    });
    this.storageService.clean();
  }
}
