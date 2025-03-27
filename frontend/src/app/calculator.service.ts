import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  selectedItemChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  emitSelectedItem(item: any) {
    this.selectedItemChanged.emit(item);
  }
}
