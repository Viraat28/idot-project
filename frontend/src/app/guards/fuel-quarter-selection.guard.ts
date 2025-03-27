import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FuelQuarterSelectionGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const user = this.storageService.getUser();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    
    if (isAdmin) {
      // Admins can access directly
      return true;
    }
    
    const selectedFuelType = this.storageService.get('selectedFuelType');
    const selectedQuarter = this.storageService.get('selectedQuarter');

    if (selectedFuelType && selectedQuarter) {
      // If both are selected, allow access
      return true;
    } else {
      // Redirect to selection prompt
      this.router.navigate(['/fuel-quarter-selection']);
      return false;
    }
  }
}
