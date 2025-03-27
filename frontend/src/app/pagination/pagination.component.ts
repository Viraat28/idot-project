import { Component, EventEmitter, Input,Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() currentPage = 1; // current page number
  @Input() totalPages = 1; // total number of pages
  @Output() pageChange = new EventEmitter<number>(); // event emitter for page change events

  constructor() { }

  // function to handle page change event
  onPageChange(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }

  public pageNumbers(): number[] {
    
    return [];
}
}
