import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChartComponent } from './chart.component';
import { By } from '@angular/platform-browser';

describe('ChartComponent', () => {
let component: ChartComponent;
let fixture: ComponentFixture<ChartComponent>;
let httpMock: HttpTestingController;

beforeEach(async () => {
await TestBed.configureTestingModule({
declarations: [ ChartComponent ],
imports: [ HttpClientTestingModule ]
})
.compileComponents();
});

beforeEach(() => {
fixture = TestBed.createComponent(ChartComponent);
component = fixture.componentInstance;
httpMock = TestBed.inject(HttpTestingController);
fixture.detectChanges();
});

it('should create', () => {
expect(component).toBeTruthy();
});

it('should have default values', () => {
expect(component.currency).toEqual('euro');
expect(component.period).toEqual(7);
expect(component.showAverageRate).toEqual(true);
expect(component.showBuyRate).toEqual(false);
expect(component.showSellRate).toEqual(false);
});

it('should update period', () => {
const newPeriod = 30;
component.updatePeriod(newPeriod);
expect(component.period).toEqual(newPeriod);
});

it('should get data', () => {
component.getData();
const req = httpMock.expectOne(`http://127.0.0.1:8000/get_currency_without_update/${component.currency}/${component.period}/`);
expect(req.request.method).toBe('GET');
req.flush([]);
});

it('should get last update', () => {
component.getLastUpdate();
const req = httpMock.expectOne(`http://127.0.0.1:8000/get_currency_update_date/${component.currency}/`);
expect(req.request.method).toBe('GET');
req.flush({last_update: '2024-04-02'});
});

it('should update data', () => {
component.updateData();
const req = httpMock.expectOne(`http://127.0.0.1:8000/get_currency/${component.currency}/${component.period}/`);
expect(req.request.method).toBe('GET');
req.flush([]);
});

it('should update chart', () => {
component.data = [{id: 1, name: 'euro', rate: '4.5', rateBuy: '4.4', rateSell: '4.6', date: '2024-04-02'}];
const createChartSpy = spyOn(component, 'createChart');
component.updateChart();
expect(createChartSpy).toHaveBeenCalled();
});

afterEach(() => {
httpMock.verify();
});
});
