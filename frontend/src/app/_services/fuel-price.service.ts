import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';

Injectable({
  providedIn: 'root',
})
export class FuelPriceService {
  private csvUrl = 'assets/data/illinois_fuel_prices.csv';

  constructor(private http: HttpClient) {}

 getFuelPriceData(): Observable<any[]> {
  return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
    map((csvData) => {
        const results = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        return results.data;
      })
    );
  }
}

//import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';

//@Injectable({
//  providedIn: 'root',
//})
//export class FuelPriceService {
//  private API_URL = 'https://idot-project-backend.vercel.app/api/';

//  constructor(private http: HttpClient) {}
//  getFuelPrice(county: string, quarter: string, fuelType: string): Observable<any> {
//    return this.http.get<any>(`${this.API_URL}fuel/fuel-price`, {
//      params: { county, quarter, fuelType }
//    });
//  }
  
  
//  getFuelMetadata(): Observable<{ counties: string[]; quarters: string[] }> {
//    return this.http.get<{ counties: string[]; quarters: string[] }>(`${this.API_URL}fuel/fuel-metadata`);
//  }
  
//  updateFuelPrices(county: string, quarter: string, prices: { [key: string]: number }) {
//    return this.http.post(`${this.API_URL}fuel/update`, { county, quarter, prices });
//  }
  
//}
