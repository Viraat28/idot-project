// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../_services/user.service';
// import { Equipment } from '../board-admin/board-admin.component';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog'; 
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
// import { Router } from '@angular/router';
// import { NotificationService } from '../_services/notification.service';

// @Component({
//   selector: 'app-equipment-manager',
//   templateUrl: './equipment-manager.component.html',
//   styleUrls: ['./equipment-manager.component.scss'],
// })
// export class EquipmentManagerComponent implements OnInit {
//   equipmentYears: string[] = [];
//   contractors: string[] = [];
//   dataLoaded = false;
//   exportFormData: string[] = [];
//   exportDataType: string = '';
//   selectedYear: string = '';
//   currentEquipmentData: Equipment[] = [];
//   showGenerateForm = false;
//   fuelCostsForm?: FormGroup;
//   labourWageForm?: FormGroup;
//   showFuelForm = false;
//   showWageForm = false;
//   showConfirmationDialog = false;
//   generateNewDataConfirmed = false;
//   confirmationMessage = 'Do you want to update all year\'s data based on the new year data?';

//   constructor(private userService: UserService, private fb: FormBuilder, private dialog: MatDialog, private router: Router, private notificationService: NotificationService) {
//     this.fuelCostsForm = this.fb.group({
//       gasoline_price: 0,
//       diesel_price: 0,
//       other: 0
//     });
//     this.labourWageForm = this.fb.group({
//       hourly_wage: 0
//     });
//   }

//   ngOnInit(): void {
//     this.loadAllData(); // ✅ Loads both model years and contractors simultaneously
//   }

//   /**
//    * Loads both model years and contractors at the same time.
//    */
//   loadAllData() {
//     this.dataLoaded = false; // Show loading state

//     Promise.all([this.fetchAllModelYears(), this.fetchAllContractors()])
//       .then(() => {
//         this.dataLoaded = true; // ✅ Ensures both sections appear together
//       })
//       .catch((error) => {
//         console.error('Error loading data:', error);
//         this.dataLoaded = true; // Still update UI even if there's an error
//       });
//   }

//   fetchAllModelYears(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.userService.getAllModelYears().subscribe(
//         (response) => {
//           this.equipmentYears = response.years.sort();
//           resolve();
//         },
//         (error) => {
//           console.error('Error fetching model years:', error);
//           reject(error);
//         }
//       );
//     });
//   }

//   fetchAllContractors(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.userService.getAllContractors().subscribe(
//         (response) => {
//           this.contractors = response.contractors;
//           resolve();
//         },
//         (error) => {
//           console.error('Error fetching contractors:', error);
//           reject(error);
//         }
//       );
//     });
//   }

//   loadEquipmentData(year: string) {
//     if (year === 'new') {
//       this.showGenerateForm = true;
//     } else if (year === 'fuel') {
//       this.loadFuelCosts();
//     } else if (year === 'wage') {
//       this.loadWageCosts();
//     } else {
//       this.router.navigate(['/equipment-list'], { queryParams: { modelYear: year, isManageEquipment: true } });
//     }
//   }

//   loadContractorData(contractor: string) {
//     this.router.navigate(['/equipment-list'], { queryParams: { contractor: contractor, isManageEquipment: true } });
//   }

//   parseContractorName(name: string) {
//     return name.replace(/-/g, " ");
//   }

//   loadFuelCosts() {
//     this.dataLoaded = false;
//     this.showFuelForm = true;
//     this.userService.getFuelCosts().subscribe(
//       (response) => {
//         this.dataLoaded = true;
//         this.setFuelFormValues(response.fuelCosts);
//       },
//       (error) => {
//         this.dataLoaded = true;
//         console.error(error);
//       }
//     );
//   }

//   loadWageCosts() {
//     this.dataLoaded = false;
//     this.showWageForm = true;
//     this.userService.getHourlyWage().subscribe(
//       (response) => {
//         this.dataLoaded = true;
//         this.setWageFormValues(response.wageCosts);
//       },
//       (error) => {
//         this.dataLoaded = true;
//         console.error(error);
//       }
//     );
//   }

//   editFuelCosts() {
//     if (this.fuelCostsForm) {
//       this.dataLoaded = false;
//       const editedFuelCosts = this.fuelCostsForm.value;
//       this.closeFuelForm();
//       this.userService.editFuelCosts(editedFuelCosts).subscribe(
//         (response) => {
//           this.showFuelForm = false;
//           this.dataLoaded = true;
//           this.notificationService.triggerNotification('Fuel costs edited successfully', 'success');
//         },
//         (error) => {
//           this.dataLoaded = true;
//           this.notificationService.triggerNotification('Error editing fuel costs', 'error');
//         }
//       );
//     }
//   }

//   editHourlyWage() {
//     if (this.labourWageForm) {
//       this.dataLoaded = false;
//       const editedWageForm = this.labourWageForm.value;
//       this.closeWageForm();
//       this.userService.editHourlyWage(editedWageForm).subscribe(
//         (response) => {
//           this.showWageForm = false;
//           this.dataLoaded = true;
//           this.notificationService.triggerNotification('Wage costs edited successfully', 'success');
//         },
//         (error) => {
//           this.dataLoaded = true;
//           this.notificationService.triggerNotification('Error editing Wage costs', 'error');
//         }
//       );
//     }
//   }

//   closeFuelForm() {
//     this.showFuelForm = false;
//   }

//   closeWageForm() {
//     this.showWageForm = false;
//   }

//   setFuelFormValues(response: any) {
//     this.fuelCostsForm?.patchValue(response);
//   }

//   setWageFormValues(response: any) {
//     this.labourWageForm?.patchValue(response);
//   }

//   generateNextYearData(priceIncreaseRate: number) {
//     this.openConfirmationDialog(priceIncreaseRate);
//   }

//   openConfirmationDialog(priceIncreaseRate: number) {
//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       disableClose: true,
//       data: { message: this.confirmationMessage },
//     });

//     dialogRef.afterClosed().subscribe((result: boolean) => {
//       if (result) {
//         this.continueGeneratingNextYearData(priceIncreaseRate, result);
//       }
//     });
//   }

//   continueGeneratingNextYearData(priceIncreaseRate: number, dataUpdate: boolean) {
//     this.dataLoaded = false;
//     this.userService.generateNextYearEquipData(priceIncreaseRate, dataUpdate).subscribe(
//       (response) => {
//         this.notificationService.triggerNotification('Next year data generated', 'success');
//         this.dataLoaded = true;
//         this.fetchAllModelYears();
//       },
//       (error) => {
//         this.dataLoaded = true;
//         this.notificationService.triggerNotification('Error generating next year data', 'error');
//       }
//     );
//     this.showGenerateForm = false;
//   }
  
  
//   exportDataForm(type: string) {
//     this.exportDataType = type;
//     this.exportFormData = type === 'equipments' ? this.equipmentYears : type === 'contractors' ? this.contractors : [];
//   }

//   exportData(data:string[]) {
//     this.userService.exportData(data, this.exportDataType).subscribe({
//       next: (blob) => {
//         const url = window.URL.createObjectURL(blob); // Create a URL from the blob
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = "EquipmentData.xlsx"; // Set the file name for download
//         document.body.appendChild(a); // Append the link to the body
//         a.click(); // Simulate click to trigger download
//         window.URL.revokeObjectURL(url); // Clean up the URL object
//         a.remove(); // Remove the link from DOM
//         this.clearExportData();
//       },
//       error: (error) => {
//         console.error('Failed to export data:', error);
//       }
//     });
//   }

//   onCancelEdit() {
//     if (this.exportDataType.length>0) {
//       this.clearExportData();
//     } else {
//     this.showGenerateForm = false;
//     }
//   }

//   clearExportData() {
//     this.exportDataType = '';
//     this.exportFormData = [];
//   }
// }  
  

import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Equipment } from '../board-admin/board-admin.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/notification.service';
import { forkJoin } from 'rxjs';


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

  constructor(private userService: UserService, private fb: FormBuilder, private dialog: MatDialog, private router: Router, private notificationService: NotificationService) {
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

  loadFuelCosts() {
    this.dataLoaded = false;
    this.showFuelForm = true;
    this.userService.getFuelCosts().subscribe(
      (response) => {
        this.dataLoaded = true;
        this.setFuelFormValues(response.fuelCosts);
      },
      (error) => {
        this.dataLoaded = true;
        console.error(error);
      }
    );
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

  editFuelCosts() {
    if (this.fuelCostsForm) {
      this.dataLoaded = false;
      const editedFuelCosts = this.fuelCostsForm.value;
      this.closeFuelForm();
      this.userService.editFuelCosts(editedFuelCosts).subscribe(
        (response) => {
          this.showFuelForm = false;
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Fuel costs edited successfully', 'success');
        },
        (error) => {
          this.dataLoaded = true;
          this.notificationService.triggerNotification('Error editing fuel costs', 'error');
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
  

