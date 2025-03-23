import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanYearlyAdminReportComponent } from './clean-yearly.component';

describe('CleanYearlyAdminReportComponent', () => {
  let component: CleanYearlyAdminReportComponent;
  let fixture: ComponentFixture<CleanYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleanYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
