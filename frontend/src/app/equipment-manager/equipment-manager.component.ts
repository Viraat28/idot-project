
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Equipment } from '../board-admin/board-admin.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/notification.service';
import { FuelPriceService } from '../_services/fuel-price.service';
import { forkJoin } from 'rxjs';

interface FuelPriceRow {
  County: string;
  Quarter: string;
  ['Gasoline Price']: string;
  ['Diesel Price']: string;
  ['Other Price']: string;
}


@Component({
  selector: 'app-equipment-manager',
  templateUrl: './equipment-manager.component.html',
  styleUrls: ['./equipment-manager.component.scss'],
})
export class EquipmentManagerComponent implements OnInit {
  equipmentYears: string[] = [];
  contractors: string[] = [];
  dataLoaded = false;
  exportFormData: string[] = [];
  exportDataType: string = '';
  selectedYear: string = '';
  currentEquipmentData: Equipment[] = [];
  showGenerateForm = false;
  fuelCostsForm?: FormGroup;
  labourWageForm?: FormGroup;
  showFuelForm = false;
  showWageForm = false;
  showConfirmationDialog = false;
  generateNewDataConfirmed = false;
  confirmationMessage = 'Do you want to update all year\'s data based on the new year data?';

  selectedCounty: string = '';
  selectedQuarter: string = '';
  
  fuelPriceData: any[] = [];              // ✅ All CSV data
  counties: string[] = [];                // ✅ Unique counties from CSV
  quarters: string[] = [];                // ✅ Unique quarters from CSV
  

  constructor(private userService: UserService, private fb: FormBuilder, private dialog: MatDialog, private router: Router, private notificationService: NotificationService, private fuelPriceService: FuelPriceService) {
    this.fuelCostsForm = this.fb.group({
      gasoline_price: 0,
      diesel_price: 0,
      other: 0
    });
    this.labourWageForm = this.fb.group({
      hourly_wage: 0
    });
  }

  ngOnInit(): void {
    this.loadAllData(); // ✅ Loads both model years and contractors simultaneously
  }

  /**
   * Loads both model years and contractors at the same time.
   */
  loadAllData() {
    this.dataLoaded = false; // Show loading state

    Promise.all([this.fetchAllModelYears(), this.fetchAllContractors()])
      .then(() => {
        this.dataLoaded = true; // ✅ Ensures both sections appear together
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        this.dataLoaded = true; // Still update UI even if there's an error
      });
  }

  fetchAllModelYears(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllModelYears().subscribe(
        (response) => {
          this.equipmentYears = response.years.sort();
          resolve();
        },
        (error) => {
          console.error('Error fetching model years:', error);
          reject(error);
        }
      );
    });
  }

  fetchAllContractors(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllContractors().subscribe(
        (response) => {
          this.contractors = response.contractors;
          resolve();
        },
        (error) => {
          console.error('Error fetching contractors:', error);
          reject(error);
        }
      );
    });
  }

  loadEquipmentData(year: string) {
    if (year === 'new') {
      this.showGenerateForm = true;
    } else if (year === 'fuel') {
      this.loadFuelCosts();
    } else if (year === 'wage') {
      this.loadWageCosts();
    } else {
      this.router.navigate(['/equipment-list'], { queryParams: { modelYear: year, isManageEquipment: true } });
    }
  }

  loadContractorData(contractor: string) {
    this.router.navigate(['/equipment-list'], { queryParams: { contractor: contractor, isManageEquipment: true } });
  }

  parseContractorName(name: string) {
    return name.replace(/-/g, " ");
  }



  // loadFuelCosts() {
  //   this.dataLoaded = false;
  //   this.showFuelForm = true;
  //   this.userService.getFuelCosts().subscribe(
  //     (response) => {
  //       this.dataLoaded = true;
  //       this.setFuelFormValues(response.fuelCosts);
  //     },
  //     (error) => {
  //       this.dataLoaded = true;
  //       console.error(error);
  //     }
  //   );
  // }



  loadFuelCosts() {
    this.dataLoaded = false;
    this.showFuelForm = true;
  
    this.fuelPriceService.getFuelMetadata().subscribe((metadata) => {
      this.counties = metadata.counties.sort();
      this.quarters = metadata.quarters.sort((a, b) => this.sortQuarter(a, b));
      this.dataLoaded = true;
    });
  }
  private sortQuarter(a: string, b: string): number {
    const order = ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec'];
  
    const [yearA, quarterA] = a.split(' ');
    const [yearB, quarterB] = b.split(' ');
  
    const yearDiff = parseInt(yearA) - parseInt(yearB);
    if (yearDiff !== 0) return yearDiff;
  
    return order.indexOf(quarterA) - order.indexOf(quarterB);
  }
  



  onCountyOrQuarterChange(): void {
    if (!this.selectedCounty || !this.selectedQuarter) return;
  
    this.fuelPriceService.getFuelPrice(this.selectedCounty, this.selectedQuarter, 'Gas')
      .subscribe({
        next: (gas) => {
          this.fuelCostsForm?.patchValue({ gasoline_price: parseFloat(gas.fuelPrice || 0) });
        },
        error: () => this.fuelCostsForm?.patchValue({ gasoline_price: 0 })
      });
  
    this.fuelPriceService.getFuelPrice(this.selectedCounty, this.selectedQuarter, 'Diesel')
      .subscribe({
        next: (diesel) => {
          this.fuelCostsForm?.patchValue({ diesel_price: parseFloat(diesel.fuelPrice || 0) });
        },
        error: () => this.fuelCostsForm?.patchValue({ diesel_price: 0 })
      });
  
    this.fuelPriceService.getFuelPrice(this.selectedCounty, this.selectedQuarter, 'Other')
      .subscribe({
        next: (other) => {
          this.fuelCostsForm?.patchValue({ other: parseFloat(other.fuelPrice || 0) });
        },
        error: () => this.fuelCostsForm?.patchValue({ other: 0 })
      });
  }
  
  
  
  
  
  

  loadWageCosts() {
    this.dataLoaded = false;
    this.showWageForm = true;
    this.userService.getHourlyWage().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.setWageFormValues(response.wageCosts);
      },
      (error) => {
        this.dataLoaded = true;
        console.error(error);
      }
    );
  }

  // editFuelCosts() {
  //   if (this.fuelCostsForm) {
  //     this.dataLoaded = false;
  //     const editedFuelCosts = this.fuelCostsForm.value;
  //     this.closeFuelForm();
  //     this.userService.editFuelCosts(editedFuelCosts).subscribe(
  //       (response) => {
  //         this.showFuelForm = false;
  //         this.dataLoaded = true;
  //         this.notificationService.triggerNotification('Fuel costs edited successfully', 'success');
  //       },
  //       (error) => {
  //         this.dataLoaded = true;
  //         this.notificationService.triggerNotification('Error editing fuel costs', 'error');
  //       }
  //     );
  //   }
  // }

  editFuelCosts() {
    if (this.fuelCostsForm && this.selectedCounty && this.selectedQuarter) {
      this.dataLoaded = false;
      const editedFuelCosts = this.fuelCostsForm.value;
  
      const prices = {
        Gas: editedFuelCosts.gasoline_price,
        Diesel: editedFuelCosts.diesel_price,
        Other: editedFuelCosts.other
      };
  
      console.log('PATCHING:', {
        county: this.selectedCounty,
        quarter: this.selectedQuarter,
        prices
      });
  
      this.fuelPriceService.updateFuelPrices(this.selectedCounty, this.selectedQuarter, prices).subscribe(
        () => {
          this.showFuelForm = false;
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Fuel costs updated in MongoDB', 'success');
        },
        (error) => {
          console.error('MongoDB fuel update failed:', error);
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Error updating fuel costs', 'error');
        }
      );
    }
  }
  
  
  
  
  

  editHourlyWage() {
    if (this.labourWageForm) {
      this.dataLoaded = false;
      const editedWageForm = this.labourWageForm.value;
      this.closeWageForm();
      this.userService.editHourlyWage(editedWageForm).subscribe(
        (response) => {
          this.showWageForm = false;
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Wage costs edited successfully', 'success');
        },
        (error) => {
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Error editing Wage costs', 'error');
        }
      );
    }
  }

  closeFuelForm() {
    this.showFuelForm = false;
  }

  closeWageForm() {
    this.showWageForm = false;
  }

  setFuelFormValues(response: any) {
    this.fuelCostsForm?.patchValue(response);
  }

  setWageFormValues(response: any) {
    this.labourWageForm?.patchValue(response);
  }

  generateNextYearData(priceIncreaseRate: number) {
    // Show the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: { message: this.confirmationMessage },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.continueGeneratingNextYearData(priceIncreaseRate, true);
      }
    });
  }

  openConfirmationDialog(priceIncreaseRate: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: { message: this.confirmationMessage },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.continueGeneratingNextYearData(priceIncreaseRate, result);
      }
    });
  }

  continueGeneratingNextYearData(priceIncreaseRate: number, dataUpdate: boolean) {
    this.dataLoaded = false;

    // In the old code, it tries to pick next year automatically & fails in 2025
    // Now we simply call a specialized function that always requests 2025
    this.generate2025Data(priceIncreaseRate, dataUpdate);
  }

  generate2025Data(priceIncreaseRate: number, dataUpdate: boolean) {
    console.log('Requesting 2025 data generation with:', {
      priceIncreaseRate,
      dataUpdate
    });
  
    this.userService.generateNextYearEquipData(priceIncreaseRate, dataUpdate).subscribe(
      (response) => {
        console.log('Response from generate 2025:', response);
        this.notificationService.triggerNotification('2025 data generated successfully', 'success');
        this.dataLoaded = true;
        this.fetchAllModelYears(); // Refresh year list
      },
      (error) => {
        console.error('Error generating 2025 data:', error);
        this.notificationService.triggerNotification('Error generating next year data', 'error');
        this.dataLoaded = true;
      }
    );
    this.showGenerateForm = false;
  }
  
  
  
  exportDataForm(type: string) {
    this.exportDataType = type;
    this.exportFormData = type === 'equipments' ? this.equipmentYears : type === 'contractors' ? this.contractors : [];
  }

  exportData(data:string[]) {
    this.userService.exportData(data, this.exportDataType).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob); // Create a URL from the blob
        const a = document.createElement('a');
        a.href = url;
        a.download = "EquipmentData.xlsx"; // Set the file name for download
        document.body.appendChild(a); // Append the link to the body
        a.click(); // Simulate click to trigger download
        window.URL.revokeObjectURL(url); // Clean up the URL object
        a.remove(); // Remove the link from DOM
        this.clearExportData();
      },
      error: (error) => {
        console.error('Failed to export data:', error);
      }
    });
  }

  onCancelEdit() {
    if (this.exportDataType.length>0) {
      this.clearExportData();
    } else {
    this.showGenerateForm = false;
    }
  }

  clearExportData() {
    this.exportDataType = '';
    this.exportFormData = [];
  }
}  
  


