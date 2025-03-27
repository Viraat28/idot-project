import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
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
