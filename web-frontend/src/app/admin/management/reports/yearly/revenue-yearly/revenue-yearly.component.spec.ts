import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueYearlyAdminReportComponent } from './revenue-yearly.component';

describe('RevenueYearlyAdminReportComponent', () => {
  let component: RevenueYearlyAdminReportComponent;
  let fixture: ComponentFixture<RevenueYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevenueYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
