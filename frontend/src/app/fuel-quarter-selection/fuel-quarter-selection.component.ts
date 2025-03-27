import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-fuel-quarter-selection',
  templateUrl: './fuel-quarter-selection.component.html',
  styleUrls: ['./fuel-quarter-selection.component.scss'],
})
export class FuelQuarterSelectionComponent {
  selectedFuelType: string = '1';
  selectedQuarter: string = '';

  quarters: string[] = [
    '2023 Jan-Mar',
    '2023 Apr-Jun',
    '2023 Jul-Sep',
    '2023 Oct-Dec',
    '2024 Jan-Mar',
    '2024 Apr-Jun',
    '2024 Jul-Sep',
    '2024 Oct-Dec',
  ];

  constructor(private router: Router, private storageService: StorageService) {}

  onProceed() {
    if (this.selectedFuelType && this.selectedQuarter) {
      // Store the selection temporarily
      this.storageService.setItem('selectedFuelType', this.selectedFuelType);
      this.storageService.setItem('selectedQuarter', this.selectedQuarter);

      // Navigate to equipment-details with state
      this.router.navigate(['/equipment-details'], {
        state: {
          selectedFuelType: this.selectedFuelType,
          selectedQuarter: this.selectedQuarter,
        },
      });
    } else {
      alert('Please select both Fuel Type and Quarter.');
    }
  }
}
