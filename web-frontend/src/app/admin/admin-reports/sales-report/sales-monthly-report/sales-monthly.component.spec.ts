import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMonthlyAdminReportComponent } from './sales-monthly.component';

describe('SalesMonthlyAdminReportComponent', () => {
  let component: SalesMonthlyAdminReportComponent;
  let fixture: ComponentFixture<SalesMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
