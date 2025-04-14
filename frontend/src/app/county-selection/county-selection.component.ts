import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-county-selection',
  templateUrl: './county-selection.component.html',
  styleUrls: ['./county-selection.component.scss'],
})
export class CountySelectionComponent {
  counties: string[] = [
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

  quarters: string[] = [
    '2023 Jan-Mar', '2023 Apr-Jun', '2023 Jul-Sep', '2023 Oct-Dec',
    '2024 Jan-Mar', '2024 Apr-Jun', '2024 Jul-Sep', '2024 Oct-Dec',
    '2025 Jan-Mar'
  ]; //added

  selectedCounty: string = '';
  selectedQuarter: string = ''; //added

  constructor(private router: Router, private storageService: StorageService) {}

  onCountySelect() {
    if (this.selectedCounty) {
      this.storageService.setItem('selectedCounty', this.selectedCounty);
  
      // Preserve equipment data while navigating
      const equipment = history.state.equipment || null;
      
      this.router.navigate(['/equipment-details'], { 
        state: { 
          county: this.selectedCounty,
          quarter: this.selectedQuarter, //added
          equipment: equipment // Preserve equipment data
        } 
      });
    }
  }
  
}
