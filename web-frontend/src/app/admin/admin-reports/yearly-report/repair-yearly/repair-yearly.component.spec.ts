import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairYearlyAdminReportComponent } from './repair-yearly.component';

describe('RepairYearlyAdminReportComponent', () => {
  let component: RepairYearlyAdminReportComponent;
  let fixture: ComponentFixture<RepairYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
