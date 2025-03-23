import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMonthlyAdminReportComponent } from './repair-monthly.component';

describe('DailyInventoryReportComponent', () => {
  let component: RepairMonthlyAdminReportComponent;
  let fixture: ComponentFixture<RepairMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
