import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMonthlyAdminReportComponent } from './customer-monthly.component';

describe('CustomerMonthlyAdminReportComponent', () => {
  let component: CustomerMonthlyAdminReportComponent;
  let fixture: ComponentFixture<CustomerMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
