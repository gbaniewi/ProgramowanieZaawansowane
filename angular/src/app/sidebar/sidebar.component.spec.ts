import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { By } from '@angular/platform-browser';

describe('SidebarComponent', () => {
let component: SidebarComponent;
let fixture: ComponentFixture<SidebarComponent>;

beforeEach(async () => {
await TestBed.configureTestingModule({
declarations: [ SidebarComponent ]
})
.compileComponents();
});

beforeEach(() => {
fixture = TestBed.createComponent(SidebarComponent);
component = fixture.componentInstance;
fixture.detectChanges();
});

it('should create', () => {
expect(component).toBeTruthy();
});

it('should emit currencySelected event when selectCurrency is called', () => {
spyOn(component.currencySelected, 'emit');
const currency = 'eur';
component.selectCurrency(currency);
expect(component.currencySelected.emit).toHaveBeenCalledWith(currency);
});

it('should call selectCurrency when a button is clicked', () => {
spyOn(component, 'selectCurrency');
const button = fixture.debugElement.query(By.css('#currencyButton'));
button.triggerEventHandler('click', null);
expect(component.selectCurrency).toHaveBeenCalled();
});
});
