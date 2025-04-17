import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Equipment } from '../board-admin/board-admin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { CalculatorService } from '../calculator.service';
import { FuelPriceService } from '../_services/fuel-price.service';

@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.scss'],
})
export class EquipmentDetailsComponent {
  @Input() equipment?: Equipment;
  ModelYear?: number;
  isAdmin = false;
  isContractor: boolean = false;
  currYear: number = 0;
  totalAnnualRepairAndComponentRate: number = 0;
  fuelUnitPrices: any;
  
  getFuelTypeLabel(): string {
    const map: { [key: number]: string } = {
      1: 'Diesel',
      2: 'Gas',
      3: 'Other'
    };
    const fuelCode = this.equipment?.['Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)'] || 3;
    //this.selectedFuelType = fuelCode ? fuelCode.toString() : '3'; // fallback to 'other'
    return map[fuelCode];
  }
  quarters: string[] = [];
 
  counties: string[] = [
    // '2023 Jan-Mar',
    // '2023 Apr-Jun',
    // '2023 Jul-Sep',
    // '2023 Oct-Dec',
    // '2024 Jan-Mar',
    // '2024 Apr-Jun',
    // '2024 Jul-Sep',
    // '2024 Oct-Dec',
    'Adams', 'Alexander', 'Bond', 'Boone', 'Brown', 'Bureau', 'Calhoun', 'Carroll', 'Cass', 'Champaign',
'Christian', 'Clark', 'Clay', 'Clinton', 'Coles', 'Cook', 'Crawford', 'Cumberland', 'DeKalb', 'DeWitt',
'Douglas', 'DuPage', 'Edgar', 'Edwards', 'Effingham', 'Fayette', 'Ford', 'Franklin', 'Fulton', 'Gallatin',
'Greene', 'Grundy', 'Hamilton', 'Hancock', 'Hardin', 'Henderson', 'Henry', 'Iroquois', 'Jackson', 'Jasper',
'Jefferson', 'Jersey', 'Jo Daviess', 'Johnson', 'Kane', 'Kankakee', 'Kendall', 'Knox', 'Lake', 'LaSalle',
'Lawrence', 'Lee', 'Livingston', 'Logan', 'Macon', 'Macoupin', 'Madison', 'Marion', 'Marshall', 'Mason',
'Massac', 'McDonough', 'McHenry', 'McLean', 'Menard', 'Mercer', 'Monroe', 'Montgomery', 'Morgan',
'Moultrie', 'Ogle', 'Peoria', 'Perry', 'Piatt', 'Pike', 'Pope', 'Pulaski', 'Putnam', 'Randolph', 'Richland',
'Rock Island', 'St. Clair', 'Saline', 'Sangamon', 'Schuyler', 'Scott', 'Shelby', 'Stark', 'Stephenson',
'Tazewell', 'Union', 'Vermilion', 'Wabash', 'Warren', 'Washington', 'Wayne', 'White', 'Whiteside', 'Will',
'Williamson', 'Winnebago', 'Woodford'

  ];

  
  fuelPriceData: any[] = [];
  selectedQuarter: string = '';
  selectedFuelType: string = '';
  selectedFuelUnitPrice: number = 0;
  selectedHorsePower: number = 0;
  selectedCounty: string = '';
  userRole: string = '';
  allFieldsReadOnly: boolean = false;


  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private calculatorService: CalculatorService,
    private cdr: ChangeDetectorRef,
    private fuelPriceService: FuelPriceService
  ) {}
  ngOnInit(): void {
    console.log('Equipment:', this.equipment);

    const user = this.storageService.getUser();
    if (user && user.roles) {
      this.userRole = user.roles.includes('ROLE_ADMIN') ? 'admin' : 'user';
    } else {
      this.userRole = 'user'; // Default to user if roles are not available
    }
    
    //this.equipment = history.state.equipment;
    this.equipment = history.state.equipment || this.storageService.getItem('selectedEquipment');

if (!this.equipment) {
  console.error('No equipment data found. Redirecting...');
  this.router.navigate(['/equipment-list']);
  return;
}

    

    
    this.isContractor = history.state.isContractor;
    this.ModelYear =
      this.isContractor && this.equipment
        ? this.equipment['Model Year']
        : history.state.modelYear;
    this.currYear = history.state.currYear;
    this.isAdmin = this.userRole = user.roles.includes('ROLE_ADMIN');
    //this.selectedQuarter = history.state.county || this.storageService.getItem('selectedQuarter') || 'Not Selected';
    this.selectedCounty = history.state.county || this.storageService.getItem('selectedCounty') || 'Not Selected';
    this.selectedQuarter = history.state.quarter || this.storageService.getItem('selectedQuarter') || 'Not Selected';

    const fuelCode = this.equipment?.['Reimbursable Fuel_type (1 diesel, 2 gas, 3 other)'];
    this.selectedFuelType = fuelCode ? fuelCode.toString() : '3';          //added - assigns the fuel type


    this.fuelPriceService.getFuelMetadata().subscribe((metadata: { counties: string[], quarters: string[] }) => {
      this.counties = metadata.counties;
      this.quarters = metadata.quarters;
    });
    


    this.setFuelUnitPriceFromMongo();
    if (!this.isAdmin) {
  
      // If both are selected, make all fields read-only
      this.allFieldsReadOnly = !!(this.selectedQuarter);
    }

    if (!this.equipment) {
      this.router.navigate(['/equipment-list']);
    } else {
      this.calculateDefaultValues();
    }
  }
  
  private setFuelUnitPriceFromMongo(): void {
    const fuelTypeLabel = this.getFuelTypeLabel();
    console.log("Calling API with:", this.selectedCounty, this.selectedQuarter, fuelTypeLabel);

    this.fuelPriceService.getFuelPrice(this.selectedCounty, this.selectedQuarter, fuelTypeLabel)
      .subscribe({
        next: (response) => {
          const price = parseFloat(response.fuelPrice);
          this.selectedFuelUnitPrice = price;
  
          if (this.equipment) {
            this.equipment.Fuel_unit_price = price;
            this.calculateFuelCost();
            this.calculateTotalOperatingCost();
          }
        },
        error: (err) => {
          console.error('Fuel price fetch failed:', err);
        }
      });
  }
  
  
  
  


  private roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  isEditable(field: string): boolean {
    // Admin can edit all fields
    if (this.isAdmin) {
      return true;
    }
    // If Fuel Type and Quarter were pre-selected, all fields are readonly
    if (this.allFieldsReadOnly) {
      return false;
    }
    // Normal user can only edit Quarter if not pre-selected
    return field === 'quarter';
  }
  
  

  private calculateDefaultValues(): void {
    if (this.equipment) {
      this.calculateTotalOperatingCost();
      console.log('out side claculating...');
      if (this.equipment !== undefined && this.ModelYear !== undefined) {
        console.log('calculating...');
        const denominator = this.equipment.Economic_Life_in_months / 12;

        this.equipment.Current_Market_Year_Resale_Value = Math.round(
          denominator
            ? Math.max(
                this.equipment.Original_price -
                  ((this.currYear - this.ModelYear) *
                    this.equipment.Original_price *
                    (1 - this.equipment.Salvage_Value)) /
                    denominator,
                this.equipment.Original_price * this.equipment.Salvage_Value
              )
            : 0
        );
        
        


        //this.selectedFuelType = '1';
        //this.equipment.Usage_rate = Number(Number((this.equipment.Monthly_use_hours / 176)).toFixed(3));
        this.equipment.Depreciation_Ownership_cost_Monthly =
          (this.equipment.Original_price *
            (1 + this.equipment.Sales_Tax) *
            (1 - this.equipment.Discount) *
            (1 - this.equipment.Salvage_Value) +
            this.equipment.Initial_Freight_cost *
              this.equipment.Original_price) /
          this.equipment.Economic_Life_in_months /
          this.equipment.Usage_rate;
        this.equipment.Cost_of_Facilities_Capital_Ownership_cost_Monthly =
          (this.equipment.Cost_of_Capital_rate *
            this.equipment.Original_price) /
          12 /
          this.equipment.Usage_rate;

        this.equipment.Overhead_Ownership_cost_Monthly =
          (this.equipment.Annual_Overhead_rate *
            this.equipment.Current_Market_Year_Resale_Value) /
          12 /
          this.equipment.Usage_rate;

        this.equipment.Overhaul_Labor_Ownership_cost_Monthly =
          (this.equipment.Hourly_Wage *
            this.equipment.Annual_Overhaul_Labor_Hours) /
          12 /
          this.equipment.Usage_rate;

        this.equipment.Overhaul_Parts_Ownership_cost_Monthly =
          (this.equipment.Annual_Overhaul_Parts_cost_rate *
            this.equipment.Original_price) /
          12 /
          this.equipment.Usage_rate;

        this.equipment.Total_ownership_cost_hourly =
          (this.equipment.Depreciation_Ownership_cost_Monthly +
            this.equipment.Cost_of_Facilities_Capital_Ownership_cost_Monthly +
            this.equipment.Overhead_Ownership_cost_Monthly +
            this.equipment.Overhaul_Labor_Ownership_cost_Monthly +
            this.equipment.Overhaul_Parts_Ownership_cost_Monthly) /
          176;
        //operating cost

        this.totalAnnualRepairAndComponentRate =
          (this.equipment
            .Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate || 0) +
          (this.equipment.Annual_Ground_Engaging_Component_rate || 0);
        this.equipment.Field_Labor_Operating_cost_Hourly =
          (this.equipment.Annual_Field_Labor_Hours *
            this.equipment.Hourly_Wage) /
          12 /
          this.equipment.Monthly_use_hours;
        this.equipment.Field_Parts_Operating_cost_Hourly =
          (this.equipment
            .Annual_Field_Repair_Parts_and_misc_supply_parts_Cost_rate *
            this.equipment.Original_price) /
          12 /
          this.equipment.Monthly_use_hours;
        this.equipment.Ground_Engaging_Component_Cost_Operating_cost_Hourly =
          (this.equipment.Annual_Ground_Engaging_Component_rate *
            this.equipment.Original_price) /
          12 /
          this.equipment.Monthly_use_hours;



        this.equipment.Fuel_by_horse_power_Operating_cost_Hourly =
          (Number(this.selectedFuelType) === 1
            ? 0.04
            : Number(this.selectedFuelType) === 2
            ? 0.06
            : 0) *
          this.equipment.Horse_power *
          this.equipment.Fuel_unit_price;
        


        this.equipment.Tire_Costs_Operating_cost_Hourly =
          this.equipment.Tire_Life_Hours === 0
            ? 0
            : this.equipment.Cost_of_A_New_Set_of_Tires /
              this.equipment.Tire_Life_Hours;

        this.equipment.Total_operating_cost =
          this.equipment.Field_Labor_Operating_cost_Hourly +
          this.equipment.Field_Parts_Operating_cost_Hourly +
          this.equipment.Ground_Engaging_Component_Cost_Operating_cost_Hourly +
          this.equipment.Lube_Operating_cost_Hourly +
          this.equipment.Fuel_by_horse_power_Operating_cost_Hourly +
          this.equipment.Tire_Costs_Operating_cost_Hourly;
        this.equipment.Total_cost_recovery =
          this.equipment.Total_ownership_cost_hourly +
          this.equipment.Total_operating_cost;
        console.log(this.equipment);
      }
    }
  }

  onCalculateCostsClicked(btnType?: string) {
    if (btnType === 'calculate' && this.equipment) {
      this.router.navigate([
        '/calculator',
        {
          modelYear: this.ModelYear,
          unadjustedRate: this.equipment.Total_ownership_cost_hourly,
          operCost: this.equipment.Total_operating_cost,
          selectedItem: JSON.stringify(this.equipment),
        },
      ]);
    } else if (btnType === 'view' && this.equipment) {
      this.calculateDefaultValues();
    }
  }

  onHorsePowerChange(event: Event) {
    const selectedHorsePower = +(event.target as HTMLSelectElement).value;
    this.selectedHorsePower = selectedHorsePower;
    if (this.equipment) {
      this.equipment.Horse_power = this.selectedHorsePower;
      //this.equipment.Fuel_unit_price = this.selectedFuelUnitPrice;
      this.calculateFuelCost();
      this.calculateTotalOperatingCost();
    }
  }

  onQuarterChange(event: Event) {
    this.selectedQuarter = (event.target as HTMLSelectElement).value;
    this.setFuelUnitPriceFromMongo();
  }
  
  onFuelTypeChange(event: Event) {
    const selectedFuelType = (event.target as HTMLSelectElement).value;
    this.selectedFuelType = selectedFuelType;
    this.setFuelUnitPriceFromMongo();
  }
  
  
  private calculateFuelCost(): void {
    if (this.equipment) {
      this.equipment.Fuel_by_horse_power_Operating_cost_Hourly =
        (Number(this.selectedFuelType) === 1
          ? 0.04
          : Number(this.selectedFuelType) === 2
          ? 0.06
          : 0) *
        this.selectedFuelUnitPrice *
        this.equipment.Horse_power * this.equipment['Adjustment for fuel cost'];

      // Manually trigger change detection after updating
      this.cdr.detectChanges();
    }
  }

  // Recalculate the total operating cost, including the updated fuel cost
  private calculateTotalOperatingCost(): void {
    if (this.equipment) {
      this.calculateFuelCost();
      this.equipment.Total_operating_cost =
        this.equipment.Field_Labor_Operating_cost_Hourly +
        this.equipment.Field_Parts_Operating_cost_Hourly +
        this.equipment.Ground_Engaging_Component_Cost_Operating_cost_Hourly +
        this.equipment.Lube_Operating_cost_Hourly +
        this.equipment.Fuel_by_horse_power_Operating_cost_Hourly +
        this.equipment.Tire_Costs_Operating_cost_Hourly;

        this.equipment.Total_cost_recovery =
        this.equipment.Total_ownership_cost_hourly +
        this.equipment.Total_operating_cost;
    }
  }
}
