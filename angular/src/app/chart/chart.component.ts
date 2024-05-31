import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface CurrencyData {
  id: number;
  name: string;
  rate: string;
  date: string;
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
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    this.getData();
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

  createChart(data: CurrencyData[]) {
    const dates = data.map(item => item.date);
    const rates = data.map(item => Number(item.rate));

    if (this.chart) {
      this.chart.destroy();
    }

    console.log('Dates: ', dates);
    console.log('Rates: ', rates);


    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: this.currency.toLocaleUpperCase(),
          data: rates,
          borderColor: '#3cba9f',
          fill: true,
          tension: 0.1
        }]
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
  }

  updatePeriod(days: number) {
    this.period = days;
    this.getData();
  }
}
