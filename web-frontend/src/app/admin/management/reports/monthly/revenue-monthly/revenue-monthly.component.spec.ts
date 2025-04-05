import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueMonthlyAdminReportComponent } from './revenue-monthly.component';

describe('RevenueMonthlyAdminReportComponent', () => {
  let component: RevenueMonthlyAdminReportComponent;
  let fixture: ComponentFixture<RevenueMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevenueMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
