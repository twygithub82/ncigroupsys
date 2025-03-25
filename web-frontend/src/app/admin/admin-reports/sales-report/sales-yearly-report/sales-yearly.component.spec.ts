import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesYearlyAdminReportComponent } from './sales-yearly.component';

describe('SalesYearlyAdminReportComponent', () => {
  let component: SalesYearlyAdminReportComponent;
  let fixture: ComponentFixture<SalesYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
