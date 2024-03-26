import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() currencySelected = new EventEmitter<string>();

  selectCurrency(currency: string) {
    this.currencySelected.emit(currency);
  }
}
