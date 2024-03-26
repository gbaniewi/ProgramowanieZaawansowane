import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface CurrencyData {
  id: number;
  name: string;
  rate: string;
  rateBuy: string;
  rateSell: string;
  date: string;
}

interface LastUpdateData {
  last_update: string;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {
  @Input() currency: string = 'euro';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;
  period: number = 7;
  data: CurrencyData[] | null = null;
  lastUpdate: string | null = null;
  isLoading: boolean = false;

  // Add properties for each rate
  showAverageRate: boolean = true;
  showBuyRate: boolean = false;
  showSellRate: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData();
    this.getLastUpdate();
  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    this.getData();
    this.getLastUpdate();
  }

  getData() {
    this.isLoading = true;
    this.http.get<CurrencyData[]>(`http://127.0.0.1:8000/get_currency_without_update/${this.currency}/${this.period}/`).subscribe((data: CurrencyData[]) => {
      this.data = data;
      this.isLoading = false;
      if (this.chartCanvas) {
        this.createChart(data);
      }
    });
  }

  getLastUpdate() {
    this.http.get<LastUpdateData>(`http://127.0.0.1:8000/get_currency_update_date/${this.currency}/`).subscribe((data: LastUpdateData) => {
      this.lastUpdate = data.last_update;
    });
  }

  createChart(data: CurrencyData[]) {
    const dates = data.map(item => item.date);
    const rates = data.map(item => Number(item.rate));
    const buyRates = data.map(item => Number(item.rateBuy));
    const sellRates = data.map(item => Number(item.rateSell));

    if (this.chart) {
      this.chart.destroy();
    }

    console.log('Dates: ', dates);
    console.log('Rates: ', rates);

    const datasets = [];
    if (this.showAverageRate) {
      datasets.push({
        label: `${this.currency.toLocaleUpperCase()} Średni kurs`,
        data: rates,
        borderColor: '#3cba9f',
        fill: true,
        tension: 0.1
      });
    }
    if (this.showBuyRate) {
      datasets.push({
        label: `${this.currency.toLocaleUpperCase()} Kurs kupna`,
        data: buyRates,
        borderColor: '#ff6384',
        fill: true,
        tension: 0.1
      });
    }
    if (this.showSellRate) {
      datasets.push({
        label: `${this.currency.toLocaleUpperCase()} Kurs sprzedaży`,
        data: sellRates,
        borderColor: '#36a2eb',
        fill: true,
        tension: 0.1
      });
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: {
            display: false,
            type: 'timeseries'  
          }
        }
      }
    });
  }

  updateData() {
    this.isLoading = true;
    this.http.get<CurrencyData[]>(`http://127.0.0.1:8000/get_currency/${this.currency}/${this.period}/`).subscribe((data: CurrencyData[]) => {
      this.data = data;
      this.isLoading = false;
      if (this.chartCanvas) {
        this.createChart(data);
      }
    });
    this.getLastUpdate();
  }

  updatePeriod(days: number) {
    this.period = days;
    this.getData();
  }

  // Add a method to update the chart when a checkbox is changed
  updateChart() {
    if (this.data && this.chartCanvas) {
      this.createChart(this.data);
    }
  }
}
