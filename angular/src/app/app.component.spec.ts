import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChartComponent } from './chart/chart.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

// Create stub components for testing
@Component({selector: 'app-sidebar', template: ''})
class SidebarStubComponent {}

@Component({selector: 'app-chart', template: ''})
class ChartStubComponent {}

describe('AppComponent', () => {
let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

beforeEach(async () => {
await TestBed.configureTestingModule({
declarations: [ AppComponent, SidebarStubComponent, ChartStubComponent ]
})
.compileComponents();
});

beforeEach(() => {
fixture = TestBed.createComponent(AppComponent);
component = fixture.componentInstance;
fixture.detectChanges();
});

it('should create', () => {
expect(component).toBeTruthy();
});

it('should have default selectedCurrency', () => {
expect(component.selectedCurrency).toEqual('eur');
});

it('should update selectedCurrency when onCurrencySelected is called', () => {
const newCurrency = 'usd';
component.onCurrencySelected(newCurrency);
expect(component.selectedCurrency).toEqual(newCurrency);
});

it('should call onCurrencySelected when currencySelected event is emitted', () => {
spyOn(component, 'onCurrencySelected');
const sidebar = fixture.debugElement.query(By.directive(SidebarStubComponent));
sidebar.triggerEventHandler('currencySelected', 'usd');
expect(component.onCurrencySelected).toHaveBeenCalledWith('usd');
});
});
