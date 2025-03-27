// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../_services/user.service';
// import { Router } from '@angular/router';

// export interface Equipment{
//   Category: string;
//   Sub_Category: string;
//   Size: string;
//   "Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)": number;
//   Fuel_unit_price: number;
//   Original_price: number;  
//   Sales_Tax: number;
//   Discount: number;
//   Salvage_Value: number;
//   Current_Market_Year_Resale_Value: number;
//   Annual_Overhaul_Labor_Hours: number;
//   Annual_Field_Labor_Hours: number;
//   Cost_of_A_New_Set_of_Tires: number;
//   Tire_Life_Hours: number;
//   Hourly_Lube_Costs: number;
//   Hourly_Wage: number;
//   "Model Year": number;
//   "Adjustment for fuel cost": number;
//   Horse_power: number;
//   Economic_Life_in_months: number;
//   Monthly_use_hours: number;
//   Usage_rate: number;
//   Initial_Freight_cost: number;
//   Annual_Overhead_rate: number;
//   Annual_Overhaul_Parts_cost_rate: number;
//   Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate: number;
//   Annual_Ground_Engaging_Component_rate: number;
//   Cost_of_Capital_rate: number,
//   Depreciation_Ownership_cost_Monthly: number,
//   Cost_of_Facilities_Capital_Ownership_cost_Monthly: number,
//   Overhead_Ownership_cost_Monthly: number,
//   Overhaul_Labor_Ownership_cost_Monthly: number,
//   Overhaul_Parts_Ownership_cost_Monthly: number,
//   Total_ownership_cost_hourly: number,
//   Field_Labor_Operating_cost_Hourly: number,
//   Field_Parts_Operating_cost_Hourly: number,
//   Ground_Engaging_Component_Cost_Operating_cost_Hourly: number,
//   Lube_Operating_cost_Hourly: number,
//   Fuel_by_horse_power_Operating_cost_Hourly: number,
//   Tire_Costs_Operating_cost_Hourly: number,
//   Total_operating_cost: number,
//   Total_cost_recovery: number
// }

// @Component({
//   selector: 'app-board-admin',
//   templateUrl: './board-admin.component.html',
//   styleUrls: ['./board-admin.component.scss']
// })


// export class BoardAdminComponent implements OnInit {
//   content?: string;
//   equipments: { [year: string]: Equipment[] } = {};
//   currentEquipmentData:Equipment[] = [];
//   equipmentDataKeys: string[] = [];
//   contractors: string[] = [];
//   dataLoaded = false;
//   modelDataSelected = false;
//   modelYear?: string = "";
//   constructor(private userService: UserService, private router: Router) { }

//   ngOnInit(): void {
//     this.userService.getUserBoard().subscribe({
//       next: data => {
//         this.content = data;
//         this.fetchModelYears();
//         setTimeout(() => {
//           this.fetchAllContractors();
//         }, 1000);

//       },
//       error: err => {
//         if (err.error) {
//           try {
//             const res = JSON.parse(err.error);
//             this.content = res.message;
//           } catch {
//             this.content = `Error with status: ${err.status} - ${err.statusText}`;
//           }
//         } else {
//           this.content = `Error with status: ${err.status}`;
//         }
//       }
//     });
//   }

//   fetchModelYears() {
//     this.userService.getAllModelYears().subscribe(
//       (response) => {
//         this.equipmentDataKeys = response.years.sort();
//         this.dataLoaded = true;
//       },
//       (error) => {
//         console.error('Error fetching model years:', error);
//       }
//     );
//   }

//   fetchAllContractors() {
//     this.userService.getAllContractors().subscribe(
//       (response) => {
//         this.dataLoaded = true;
//         this.contractors = response.contractors;
//       },
//       (error) => {
//         this.dataLoaded = true
//         console.error(error);
//       }
//     );
//   }

//   loadEquipmentData(year: string) {
//     // this.dataLoaded = false;
//     // // Fetch model data for the selected year
//     // this.userService.getModelDataByYear(year).subscribe(
//     //   (response) => {
//     //     this.currentEquipmentData = response.data;
//     //     this.modelDataSelected = true;
//     //     this.dataLoaded = true;
//     //     this.modelYear = year;
//     //   },
//     //   (error) => {
//     //     // Handle error while fetching model data
//     //     console.error(`Error fetching model data for year ${year}:`, error);
//     //   }
//     // );

//     this.router.navigate(['/equipment-list'], { queryParams: { modelYear: year } });
 
//   }

//   parseContractorName(name: string) {
//     return name.split("-").join(" ");
//   }
//   loadContractorData(contractor: string) {
//     this.router.navigate(['/equipment-list'], { queryParams: { contractor: contractor} });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

export interface Equipment {
  Category: string;
  Sub_Category: string;
  Size: string;
  "Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)": number;
  Fuel_unit_price: number;
  Original_price: number;
  Sales_Tax: number;
  Discount: number;
  Salvage_Value: number;
  Current_Market_Year_Resale_Value: number;
  Annual_Overhaul_Labor_Hours: number;
  Annual_Field_Labor_Hours: number;
  Cost_of_A_New_Set_of_Tires: number;
  Tire_Life_Hours: number;
  Hourly_Lube_Costs: number;
  Hourly_Wage: number;
  "Model Year": number;
  "Adjustment for fuel cost": number;
  Horse_power: number;
  Economic_Life_in_months: number;
  Monthly_use_hours: number;
  Usage_rate: number;
  Initial_Freight_cost: number;
  Annual_Overhead_rate: number;
  Annual_Overhaul_Parts_cost_rate: number;
  Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate: number;
  Annual_Ground_Engaging_Component_rate: number;
  Cost_of_Capital_rate: number;
  Depreciation_Ownership_cost_Monthly: number;
  Cost_of_Facilities_Capital_Ownership_cost_Monthly: number;
  Overhead_Ownership_cost_Monthly: number;
  Overhaul_Labor_Ownership_cost_Monthly: number;
  Overhaul_Parts_Ownership_cost_Monthly: number;
  Total_ownership_cost_hourly: number;
  Field_Labor_Operating_cost_Hourly: number;
  Field_Parts_Operating_cost_Hourly: number;
  Ground_Engaging_Component_Cost_Operating_cost_Hourly: number;
  Lube_Operating_cost_Hourly: number;
  Fuel_by_horse_power_Operating_cost_Hourly: number;
  Tire_Costs_Operating_cost_Hourly: number;
  Total_operating_cost: number;
  Total_cost_recovery: number;
}

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  equipments: { [year: string]: Equipment[] } = {};
  currentEquipmentData: Equipment[] = [];
  equipmentDataKeys: string[] = [];
  contractors: string[] = [];
  dataLoaded: boolean = false; // ✅ FIX: Define the missing property
  modelDataSelected: boolean = false;
  modelYear?: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserBoard().subscribe({
      next: (data) => {
        this.content = data;
        this.fetchData();
      },
      error: (err) => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }

  fetchData() {
    this.dataLoaded = false; // Ensures loading is shown

    Promise.all([this.fetchModelYears(), this.fetchAllContractors()])
      .then(() => {
        this.dataLoaded = true; // Set to true only after both fetches complete
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.dataLoaded = true; // Ensure UI still updates even on failure
      });
  }

  fetchModelYears(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllModelYears().subscribe(
        (response) => {
          this.equipmentDataKeys = response.years.sort();
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
          console.error(error);
          reject(error);
        }
      );
    });
  }

  loadEquipmentData(year: string) {
    this.router.navigate(['/equipment-list'], { queryParams: { modelYear: year } });
  }

  parseContractorName(name: string) {
    return name.split('-').join(' ');
  }

  loadContractorData(contractor: string) {
    this.router.navigate(['/equipment-list'], { queryParams: { contractor: contractor } });
  }
}


