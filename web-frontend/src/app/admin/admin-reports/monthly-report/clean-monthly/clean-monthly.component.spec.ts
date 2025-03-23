import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanMonthlyAdminReportComponent } from './clean-monthly.component';

describe('DailyInventoryReportComponent', () => {
  let component: CleanMonthlyAdminReportComponent;
  let fixture: ComponentFixture<CleanMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleanMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
