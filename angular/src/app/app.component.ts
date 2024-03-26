import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedCurrency: string = 'eur';

  onCurrencySelected(currency: string) {
    this.selectedCurrency = currency;
  }
}
